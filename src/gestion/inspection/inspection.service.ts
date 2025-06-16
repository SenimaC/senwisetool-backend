import { Injectable, NotFoundException } from '@nestjs/common';
import { Inspection } from '@prisma/client';
import {
  errorResponse,
  successResponse,
} from 'src/common/helpers/api-response.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddInspectionLocationDto,
  CreateInspectionDto,
} from './inspection.dto';

@Injectable()
export class InspectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInspectionDto, companyId: string) {
    try {
      const newInspection = await this.prisma.inspection.create({
        data: {
          ...dto,
          company: {
            connect: { id: companyId },
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
    userId: string,
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

    // const user = await this.prisma.user.findUnique({
    //   where: { id: userId },
    //   include: { company: true },
    // });

    // if (!user || user.companyId !== inspection.company.id) {
    //   throw new NotFoundException(
    //     "Vous n'appartenez pas à la compagnie de cette inspection",
    //   );
    // }

    // if (!['DG', 'ADG'].includes(user.role)) {
    //   throw new NotFoundException(
    //     "Vous n'avez pas les droits pour ajouter une localisation",
    //   );
    // }

    const updatedInspection = await this.prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        country: dto.country,
        region: dto.region,
        city: dto.city,
        address: dto.address,
      },
    });

    return successResponse(
      'Localisation ajoutée avec succès',
      200,
      updatedInspection,
    );
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
}
