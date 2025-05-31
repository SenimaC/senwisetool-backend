import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { generate6DigitCode } from 'src/common/helpers/string-generator';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCompanyStepContactDto,
  CreateCompanyStepEmailVerificationDto,
  CreateCompanyStepInitDto,
  CreateCompanyStepLocationDto,
} from './company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly mailService: MailService,
    private prisma: PrismaService,
  ) {}

  async createStepCompany(
    dto: CreateCompanyStepInitDto,
    ownerId: string,
    bucketName: string,
    logoUrl: string,
  ) {
    // Vérifier si une compagnie existe déjà pour cet utilisateur
    const company = await this.prisma.company.findUnique({
      where: { ownerId },
    });

    if (company) {
      throw new Error(
        `Cet utilisateur possède déjà une compagnie.${bucketName} - ${logoUrl}`,
      );
    }

    // Créer la compagnie
    // const newCompany = await this.prisma.company.create({
    //   data: {
    //     ...dto,
    //     bucketName,
    //     logo: logoUrl,
    //     onboardingSteps: [1],
    //     owner: {
    //       connect: { id: ownerId },
    //     },
    //   },
    // });

    const apiResponse = {
      message: 'Compagnie créée avec succès',
      statusCode: 201,
      // data: newCompany,
    };

    Logger.log(apiResponse);
    return apiResponse;
  }

  async createStepLocation(dto: CreateCompanyStepLocationDto, ownerId: string) {
    const company = await this.prisma.company.findUnique({
      where: { ownerId },
    });

    if (!company) {
      throw new Error('Cet utilisateur ne possède pas compagnie.');
    }

    const companyUpdated = await this.prisma.company.update({
      where: { id: company.id },
      data: {
        ...dto,
        onboardingSteps: { push: 2 },
      },
    });

    const apiResponse = {
      message: 'données de localisation enregistrées avec succès',
      statusCode: 201,
      data: companyUpdated,
    };

    return apiResponse;
  }

  async createStepContact(dto: CreateCompanyStepContactDto, ownerId: string) {
    const company = await this.prisma.company.findUnique({
      where: { ownerId },
    });

    if (!company) {
      throw new Error('Cet utilisateur ne possède pas compagnie.');
    }

    const companyUpdated = await this.prisma.company.update({
      where: { id: company.id },
      data: {
        ...dto,
        onboardingSteps: { push: 3 },
      },
    });

    await this.createStepResendEmailVerification(dto.email, ownerId);

    const apiResponse = {
      message:
        'Contacts enregistrées avec succès. Un code de vérification a été envoyé à cette email...',
      statusCode: 201,
      data: companyUpdated,
    };

    return apiResponse;
  }

  async createStepEmailVerification(
    dto: CreateCompanyStepEmailVerificationDto,
    ownerId: string,
  ) {
    const company = await this.prisma.company.findUnique({
      where: { ownerId },
    });

    if (!company) {
      throw new Error('Cet utilisateur ne possède pas compagnie.');
    }

    // if (company.emailVerified) return { message: 'Email déjà vérifié' };

    if (
      !company.emailVerificationCode ||
      company.emailVerificationCode !== dto.code
    ) {
      throw new ForbiddenException('Code de vérification invalide');
    }

    if (
      company.emailVerificationExpires &&
      company.emailVerificationExpires < new Date()
    ) {
      throw new ForbiddenException('Code expiré');
    }

    // await this.prisma.company.update({
    //   where: { email: company.email },
    //   data: {
    //     emailVerified: true,
    //     emailVerificationCode: null,
    //     emailVerificationExpires: null,
    //   },
    // });

    const apiResponse = {
      message: `${company.email} : Email de la compagny vérifié avec succès.`,
      statusCode: 201,
    };

    Logger.log(apiResponse);
    return apiResponse;
  }

  async createStepResendEmailVerification(email: string, ownerId: string) {
    const code = generate6DigitCode;
    await this.mailService.sendVerificationCode(email, code);
    await this.prisma.company.update({
      where: { ownerId },
      data: {
        emailVerificationCode: code,
        emailVerificationExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      },
    });

    const apiResponse = {
      message: 'email de verification envoyée avec succes',
      statusCode: 201,
    };

    Logger.log(apiResponse);
    return apiResponse;
  }
}
