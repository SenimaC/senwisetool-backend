// campaign.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCampaignDto } from './campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        status: dto.status ?? 'CURRENT',
      },
    });
  }

  findAll() {
    return this.prisma.campaign.findMany();
  }

  findOne(id: string) {
    return this.prisma.campaign.findUnique({ where: { id } });
  }

  async remove(id: string) {
    const campaign = await this.findOne(id);
    if (!campaign) throw new NotFoundException('Campagne introuvable');
    return this.prisma.campaign.delete({ where: { id } });
  }

  async update(id: string, dto: CreateCampaignDto) {
    const campaign = await this.findOne(id);
    if (!campaign) throw new NotFoundException('Campagne introuvable');
    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }
}
