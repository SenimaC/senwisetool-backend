import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Inspection } from '@prisma/client';
import { AllRoles } from 'src/common/constants/roles.constant';
import {
  errorResponse,
  successResponse,
} from 'src/common/helpers/api-response.helper';
import { CurrentUser } from 'src/common/types/user.type';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddInspectionLocationDto,
  CreateInspectionDto,
  InspectionRequirementsDto,
} from './inspection.dto';

@Injectable()
export class InspectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInspectionDto, user: CurrentUser) {
    try {
      this.canManage(user.Role.name);

      const newInspection = await this.prisma.inspection.create({
        data: {
          ...dto,
          company: {
            connect: { id: user.companyId },
          },
        },
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

    this.canManage(user.Role.name);

    if (user.companyId !== inspection.companyId) {
      throw new UnauthorizedException(
        "Vous n'appartenez pas à la compagnie de cette inspection",
      );
    }

    const updatedInspection = await this.prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        ...dto,
      },
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
      });

      if (!inspection) {
        throw new NotFoundException(
          `Inspection avec ID "${inspectionId}" introuvable`,
        );
      }

      this.canManage(user.Role.name);

      if (user.companyId !== inspection.companyId) {
        throw new UnauthorizedException(
          "Vous n'appartenez pas à la compagnie de cette inspection",
        );
      }

      const updatedInspection = await this.prisma.inspection.update({
        where: { id: inspectionId },
        data: {
          // requirements: dto.requirements,
        },
      });

      return successResponse(
        'Création de compagnie initiée...',
        201,
        updatedInspection,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  async findAll(): Promise<Inspection[]> {
    return this.prisma.inspection.findMany({
      include: {
        requirements: true,
        company: true,
      },
    });
  }

  async findOne(id: string): Promise<Inspection> {
    const inspection = await this.prisma.inspection.findUnique({
      where: { id },
      include: {
        requirements: true,
        company: true,
      },
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection avec ID "${id}" introuvable`);
    }

    return inspection;
  }

  async update(id: string, dto: CreateInspectionDto): Promise<Inspection> {
    await this.findOne(id); // Vérifie si l’inspection existe

    return this.prisma.inspection.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        activitySector: dto.activitySector,
        type: dto.type,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Vérifie si l’inspection existe

    await this.prisma.inspection.delete({
      where: { id },
    });
  }

  canManage(roleName: string) {
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
  }
}
