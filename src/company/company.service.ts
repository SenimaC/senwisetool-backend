import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyStepCompanyDto } from './company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async createStepCompany(
    dto: CreateCompanyStepCompanyDto,
    owner: string,
    bucketName: string,
    logoUrl: string,
  ) {
    const company = await this.prisma.company.create({
      data: {
        ...dto,
        bucketName,
        logo: logoUrl,
        onboardingSteps: [1],
        owner: {
          connect: { id: owner },
        },
      },
    });

    return { message: 'Étape 1 enregistrée', data: company };
  }

  // async updateStep2(companyId: string, data: CreateCompanyStep2Dto) {
  //   const company = await this.prisma.company.update({
  //     where: { id: companyId },
  //     data: {
  //       ...data,
  //       onboardingSteps: { push: 2 },
  //     },
  //   });

  //   return { message: 'Étape 2 enregistrée', data: company };
  // }

  // async updateStep3(companyId: string, data: CreateCompanyStep3Dto) {
  //   const company = await this.prisma.company.update({
  //     where: { id: companyId },
  //     data: {
  //       ...data,
  //       onboardingSteps: { push: 3 },
  //     },
  //   });

  //   return { message: 'Étape 3 enregistrée', data: company };
  // }
}
