import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CampaignStatus, Inspection, InspectionStatus } from '@prisma/client';
import { AllRoles } from 'src/common/constants/roles.constant';
import {
  errorResponse,
  successResponse,
} from 'src/common/helpers/api-response.helper';
import { CurrentUser } from 'src/common/types/user.type';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddInspectionLocationDto,
  AssistanToAssignDto,
  CreateInspectionDto,
  InspectionRequirementsDto,
} from './inspection.dto';

@Injectable()
export class InspectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInspectionDto, user: CurrentUser) {
    try {
      this.isInspectionManager(user.Role.name, user.companyId);

      // Récupérer la campagne courante de la compagnie de l'utilisateur
      const currentCampaign = await this.prisma.campaign.findFirst({
        where: {
          status: CampaignStatus.CURRENT,
        },
      });

      if (!currentCampaign)
        throw new NotFoundException('Aucune campagne courante');

      const newInspection = await this.prisma.inspection.create({
        data: {
          ...dto,
          Campaign: {
            connect: { id: currentCampaign.id },
          },
          company: {
            connect: { id: user.companyId },
          },
        },
        include: { requirements: true },
      });

      return successResponse(
        'Inspection créée avec succès',
        201,
        newInspection,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  async addLocation(
    inspectionId: string,
    dto: AddInspectionLocationDto,
    user: CurrentUser,
  ) {
    // Vérifier que l'utilisateur appartient à la compagnie de l'inspection
    const inspection = await this.prisma.inspection.findUnique({
      where: { id: inspectionId },
    });

    if (!inspection) {
      throw new NotFoundException(
        `Inspection avec ID "${inspectionId}" introuvable`,
      );
    }

    this.isInspectionManager(
      user.Role.name,
      user.companyId,
      inspection.companyId,
    );

    const updatedInspection = await this.prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        ...dto,
      },
      include: { requirements: true },
    });

    return successResponse(
      'Localisation ajoutée avec succès',
      200,
      updatedInspection,
    );
  }

  async partnersLogos(
    inspectionId: string,
    userId: string,
    logoUrls: string[],
  ) {
    try {
      // Vérifier que l'utilisateur appartient à la compagnie de l'inspection
      const inspection = await this.prisma.inspection.findUnique({
        where: { id: inspectionId },
      });

      if (!inspection) {
        throw new NotFoundException(
          `Inspection avec ID "${inspectionId}" introuvable`,
        );
      }

      const inspectionUpdated = await this.prisma.inspection.update({
        where: { id: inspectionId },
        data: {
          partnersLogos: logoUrls,
        },
      });

      return successResponse(
        'Création de compagnie initiée...',
        201,
        inspectionUpdated,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  async requirements(
    inspectionId: string,
    dto: InspectionRequirementsDto,
    user: CurrentUser,
  ) {
    try {
      // Vérifier que l'utilisateur appartient à la compagnie de l'inspection
      const inspection = await this.prisma.inspection.findUnique({
        where: { id: inspectionId },
        include: { requirements: true },
      });

      if (!inspection)
        throw new NotFoundException(
          `Inspection avec ID "${inspectionId}" introuvable`,
        );

      this.isInspectionManager(
        user.Role.name,
        user.companyId,
        inspection.companyId,
      );

      if (user.companyId !== inspection.companyId)
        throw new UnauthorizedException(
          "Vous n'appartenez pas à la compagnie de cette inspection",
        );

      // Récupérer les requirements actuels du chapitre courant
      const chapterRequirements = (
        await this.prisma.requirement.findMany({
          where: {
            section: {
              chapterId: dto.chapter,
            },
          },
          select: { id: true },
        })
      ).map((req) => req.id);

      // Récupérer les requirements actuels de l'inspection
      const currentDBRequirements =
        inspection?.requirements
          .map((r) => r.id)
          .filter((id) => chapterRequirements.includes(id)) || [];

      // Trouver les requirements à ajouter (ceux qui ne sont pas déjà présents)
      const requirementsToAdd = dto.requirements.filter(
        (id) => !currentDBRequirements.includes(id),
      );

      // Trouver les requirements à supprimer (ceux qui ne sont plus dans le dto)
      const requirementsToRemove = currentDBRequirements.filter(
        (id) => !dto.requirements.includes(id),
      );

      // Retirer les requirements à supprimer
      if (requirementsToRemove.length > 0) {
        await this.prisma.inspection.update({
          where: { id: inspectionId },
          data: {
            requirements: {
              disconnect: requirementsToRemove.map((id) => ({ id })),
            },
          },
        });
      }

      // Ajouter les nouveaux requirements
      let updatedInspection: Inspection;
      if (requirementsToAdd.length > 0) {
        updatedInspection = await this.prisma.inspection.update({
          where: { id: inspectionId },
          data: {
            requirements: {
              connect: requirementsToAdd.map((id) => ({ id })),
            },
          },
          include: { requirements: true },
        });
      }

      return successResponse(
        'Création de compagnie initiée...',
        201,
        updatedInspection,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  async validateCreation(inspectionId: string, user: CurrentUser) {
    // Vérifier que l'utilisateur appartient à la compagnie de l'inspection
    const inspection = await this.prisma.inspection.findUnique({
      where: { id: inspectionId },
    });

    if (!inspection) {
      throw new NotFoundException(
        `Inspection avec ID "${inspectionId}" introuvable`,
      );
    }

    this.isInspectionManager(
      user.Role.name,
      user.companyId,
      inspection.companyId,
    );

    const updatedInspection = await this.prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        status: InspectionStatus.DRAFT,
      },
      include: { requirements: true },
    });

    return successResponse(
      'Localisation ajoutée avec succès',
      200,
      updatedInspection,
    );
  }

  async publish(inspectionId: string, user: CurrentUser) {
    // Vérifier que l'utilisateur appartient à la compagnie de l'inspection
    const inspection = await this.prisma.inspection.findUnique({
      where: { id: inspectionId },
    });

    if (!inspection) {
      throw new NotFoundException(
        `Inspection avec ID "${inspectionId}" introuvable`,
      );
    }

    this.isInspectionManager(
      user.Role.name,
      user.companyId,
      inspection.companyId,
    );

    const updatedInspection = await this.prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        status: InspectionStatus.PUBLISHED,
      },
      include: { requirements: true },
    });

    return successResponse(
      'Localisation ajoutée avec succès',
      200,
      updatedInspection,
    );
  }

  async findAll(companyId: string) {
    try {
      const inspections = this.prisma.inspection.findMany({
        where: { companyId },
        include: {
          requirements: true,
          company: true,
        },
      });

      return successResponse('List of inspections', 201, inspections);
    } catch (error) {
      errorResponse(error);
    }
  }

  async findOne(id: string, companyId: string) {
    try {
      const inspection = await this.prisma.inspection.findUnique({
        where: { id, companyId },
        include: {
          requirements: true,
          company: true,
          ProjectAssignment: true,
        },
      });

      if (!inspection) {
        throw new NotFoundException(`Inspection avec ID "${id}" introuvable`);
      }

      return successResponse("Projet d'inspection trouvé", 204, inspection);
    } catch (error) {
      errorResponse(error);
    }
  }

  async update(
    id: string,
    user: CurrentUser,
    dto: Partial<CreateInspectionDto> | Partial<AddInspectionLocationDto>,
  ) {
    try {
      const inspection = await this.findOne(id, user.companyId);

      if (inspection.error) throw new NotFoundException(inspection.message);

      this.isInspectionManager(
        user.Role.name,
        user.companyId,
        inspection.data.campaignId,
      );

      const inspectionUpdated = this.prisma.inspection.update({
        where: { id },
        data: {
          ...dto,
        },
      });

      return successResponse(
        'Inspection mise à jour avec succès',
        201,
        inspectionUpdated,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  async remove(id: string, user: CurrentUser) {
    try {
      const inspection = await this.findOne(id, user.companyId); // Vérifie si l’inspection existe

      this.isInspectionManager(
        user.Role.name,
        user.companyId,
        inspection.data.campaignId,
      );

      await this.prisma.inspection.delete({
        where: { id },
      });

      return successResponse('Suppression éffectuée avec succès');
    } catch (error) {
      return errorResponse(error);
    }
  }

  async AddAssignement(
    id: string,
    dto: AssistanToAssignDto,
    user: CurrentUser,
  ) {
    try {
      const inspection = await this.findOne(id, user.companyId); // Vérifie si l’inspection existe

      this.isInspectionManager(
        user.Role.name,
        user.companyId,
        inspection.data.campaignId,
      );

      for (const assistantId of dto.assistantAccountIds) {
        // Récupérer l'inspection avec les assignments existants
        const existingAssignment = inspection.data.ProjectAssignment.find(
          (assignment) =>
            assignment.inspectionId === id &&
            assignment.assistantAccountId === assistantId,
        );

        if (!existingAssignment) {
          await this.prisma.projectAssignment.create({
            data: {
              AssistantAccount: { connect: { id: assistantId } },
              Inspection: { connect: { id } },
            },
          });
        }
      }

      return successResponse('Suppression éffectuée avec succès');
    } catch (error) {
      return errorResponse(error);
    }
  }

  isInspectionManager(
    roleName: string,
    userCompanyId: string,
    inspectionCompanyId?: string,
  ) {
    if (
      !(
        [
          AllRoles.LEAD_DEVELOPER,
          AllRoles.DEVELOPER,
          AllRoles.DG,
          AllRoles.ADG,
        ] as string[]
      ).includes(roleName)
    )
      throw new UnauthorizedException("Vous n'avez pas les droits requises");

    if (inspectionCompanyId && userCompanyId !== inspectionCompanyId) {
      throw new UnauthorizedException(
        "Vous n'appartenez pas à la compagnie de cette inspection",
      );
    }
  }
}
