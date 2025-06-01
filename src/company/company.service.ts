import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import {
  errorResponse,
  successResponse,
} from 'src/common/helpers/api-response.helper';
import { generate6DigitCode } from 'src/common/helpers/string-generator';
import { CompanyResponse, CompanyStatus } from 'src/common/types/company.type';
import { EmailVerificationContext } from 'src/common/types/mail';
import { UserRole } from 'src/common/types/user.type';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCompanyStepContactDto,
  CreateCompanyStepEmailVerificationDto,
  CreateCompanyStepInitDto,
  CreateCompanyStepLocationDto,
  RejetAutorizationDto,
  ValidateAutorizationDto,
} from './company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly mailService: MailService,
    @Inject(forwardRef(() => AuthService)) // ✅ Important
    private readonly authService: AuthService,
    private prisma: PrismaService,
  ) {}

  async createStepCompany(
    dto: CreateCompanyStepInitDto,
    userId: string,
    bucketName: string,
    logoUrl: string,
    authorizationUrl: string,
  ) {
    try {
      // Vérifier si une compagnie existe déjà pour cet utilisateur
      if (await this.hasCompany(userId)) {
        throw new Error(`Cet utilisateur possède déjà une compagnie.`);
      }

      // Créer la compagnie
      const newCompany = await this.prisma.company.create({
        data: {
          ...dto,
          bucketName,
          logo: logoUrl,
          authorization: authorizationUrl,
          onboardingSteps: [1],
        },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          company: {
            connect: { id: newCompany.id },
          },
        },
      });

      return successResponse(
        'Création de compagnie initiée...',
        201,
        newCompany as CompanyResponse,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  async createStepLocation(dto: CreateCompanyStepLocationDto, userId: string) {
    try {
      const companyId = await this.hasCompany(userId);

      if (!companyId) {
        throw new Error('Cet utilisateur ne possède pas compagnie.');
      }

      const companyUpdated = await this.prisma.company.update({
        where: { id: companyId },
        data: {
          ...dto,
          onboardingSteps: { push: 2 },
        },
      });

      return successResponse(
        'données de localisation mises à jour avec succès',
        201,
        companyUpdated as CompanyResponse,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  async createStepContact(dto: CreateCompanyStepContactDto, userId: string) {
    try {
      const companyId = await this.hasCompany(userId);

      if (!companyId) {
        throw new Error('Cet utilisateur ne possède pas compagnie.');
      }

      const companyUpdated = await this.prisma.company.update({
        where: { id: companyId },
        data: {
          ...dto,
          onboardingSteps: { push: 3 },
        },
      });

      await this.resendEmailVerification(userId);

      return successResponse(
        'contact de la compagnie mise à jour avec succès',
        201,
        companyUpdated as CompanyResponse,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  async createStepEmailVerification(
    dto: CreateCompanyStepEmailVerificationDto,
    userId: string,
  ) {
    try {
      const companyId = await this.hasCompany(userId);

      if (!companyId) {
        throw new Error('Cet utilisateur ne possède pas compagnie.');
      }

      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
      });

      if (company.isEmailVerified)
        throw new ForbiddenException('Email déjà vérifié');

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

      await this.prisma.company.update({
        where: { email: company.email },
        data: {
          onboardingSteps: { push: 4 },
          isEmailVerified: true,
          emailVerificationCode: null,
          emailVerificationExpires: null,
        },
      });

      const companyValidated = await this.validateCreationProcess(company.id);

      return companyValidated;
    } catch (error) {
      errorResponse(error);
    }
  }

  async resendEmailVerification(userId: string) {
    try {
      const companyId = await this.hasCompany(userId);

      if (!companyId) {
        throw new Error('Cet utilisateur ne possède pas compagnie.');
      }

      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
      });

      const code = generate6DigitCode;
      await this.mailService.sendEmailVerificationCode(
        company.email,
        code,
        EmailVerificationContext.COMPANY,
      );
      const companyUpdated = await this.prisma.company.update({
        where: { id: companyId },
        data: {
          emailVerificationCode: code,
          emailVerificationExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 min
        },
      });

      return successResponse(
        'Email de vérification envoyée avec succès',
        201,
        companyUpdated,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  private async validateCreationProcess(companyId: string) {
    try {
      const companyCompleted = await this.prisma.company.update({
        where: { id: companyId },
        data: {
          status: CompanyStatus.PENDING,
        },
      });

      return successResponse(
        'Votre compagnie à été créé. En cours de validation...',
        201,
        companyCompleted as CompanyResponse,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  async ValidateAutorization(dto: ValidateAutorizationDto) {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id: dto.companyId, email: dto.companyEmail },
      });

      if (!company) {
        throw new Error('Compagnie introuvable.');
      }

      const newUser = await this.authService.register({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.validationEmail,
        role: UserRole.PDG,
        companyId: dto.companyId,
      });

      return successResponse(
        'Autorisation accordée. En attente de la validation du PDG',
        201,
        newUser,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  async RejetAutorization(dto: RejetAutorizationDto) {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id: dto.companyId, email: dto.companyEmail },
      });

      if (!company) {
        throw new Error('Compagnie introuvable.');
      }

      await this.mailService.sendMessage(dto.compagnyEmailUser, dto.comment);
      await this.prisma.company.update({
        where: { id: dto.companyId },
        data: { status: CompanyStatus.PENDING },
      });

      return successResponse('Demande de rejet effectuée', 201);
    } catch (error) {
      errorResponse(error);
    }
  }

  hasCompany = async (userId: string): Promise<string | null> => {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { company: { select: { id: true } } },
    });

    return user.company.id ?? null;
  };

  async getCompany(companyId: string) {
    return this.prisma.company.findUnique({
      where: { id: companyId },
      include: { User: true }, // si tu veux inclure les utilisateurs liés
    });
  }
}
