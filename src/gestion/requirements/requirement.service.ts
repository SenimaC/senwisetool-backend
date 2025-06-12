import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RequirementService {
  constructor(private readonly prisma: PrismaService) {}

  // async create(dto: CreateRequirementDto) {
  //   return this.prisma.requirement.create({
  //     data: {
  //       title: dto.title,
  //       description: dto.description,
  //       challengeId: dto.challengeId,
  //     },
  //   });
  // }

  // async findAll() {
  //   return this.prisma.requirement.findMany();
  // }

  // async findById(id: string) {
  //   const requirement = await this.prisma.requirement.findUnique({
  //     where: { id },
  //   });
  //   if (!requirement) throw new NotFoundException('Requirement not found');
  //   return requirement;
  // }

  // async update(id: string, dto: UpdateRequirementDto) {
  //   await this.findById(id); // pour valider l'existence
  //   return this.prisma.requirement.update({
  //     where: { id },
  //     data: dto,
  //   });
  // }

  // async delete(id: string) {
  //   await this.findById(id); // pour valider l'existence
  //   return this.prisma.requirement.delete({ where: { id } });
  // }
}
