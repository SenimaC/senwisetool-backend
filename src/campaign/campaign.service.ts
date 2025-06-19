import { CampaignStatus } from './campaign.dto';
// campaign.service.ts
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  errorResponse,
  successResponse,
} from 'src/common/helpers/api-response.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCampaignDto } from './campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCampaignDto) {
    try {
      const existCurrentCampaign = await this.prisma.campaign.findFirst({
        where: { status: CampaignStatus.CURRENT },
      });

      if (existCurrentCampaign)
        throw new ConflictException(
          'Une campagne est déjà en cours. Veuillez dabord la terminer',
        );

      const newCampaign = await this.prisma.campaign.create({
        data: dto,
      });

      return successResponse('Campagne créée avec succès', 201, newCampaign);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async findAll() {
    try {
      const campaigns = await this.prisma.campaign.findMany();

      return successResponse('Campagnes disponibles', 204, campaigns);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      const campaign = await this.prisma.campaign.findUnique({ where: { id } });

      return successResponse('Campagnes disponibles', 204, campaign);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      const campaign = await this.prisma.campaign.findUnique({ where: { id } });
      if (!campaign) throw new NotFoundException('Campagne introuvable');

      const campaignToRemove = await this.prisma.campaign.delete({
        where: { id },
      });
      return successResponse(
        'Campagne supprimée avec succès',
        200,
        campaignToRemove,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async update(id: string, dto: CreateCampaignDto) {
    try {
      const campaign = await this.prisma.campaign.findUnique({ where: { id } });
      if (!campaign) throw new NotFoundException('Campagne introuvable');

      if (campaign.status != CampaignStatus.CURRENT)
        throw new ForbiddenException('Campagne déjà terminée');

      const updatedCampaign = await this.prisma.campaign.update({
        where: { id },
        data: {
          ...dto,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
        },
      });
      return successResponse(
        'Campagne mise à jour avec succès',
        200,
        updatedCampaign,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }
}
