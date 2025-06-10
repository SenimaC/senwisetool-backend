import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Company, CompanyStatus } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import {
  errorResponse,
  successResponse,
} from 'src/common/helpers/api-response.helper';
import { generate6DigitCode } from 'src/common/helpers/string-generator';
import { CompanyResponse } from 'src/common/types/company.type';
import { EmailVerificationContext } from 'src/common/types/mail';
import { UserResponse } from 'src/common/types/user.type';
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

  /**
   * Création de la compagnie : Etape d'initialisation avec les informations sur l'identité de la compagnie
   * @param dto - CreateCompanyStepInitDto
   * @param userId - ID de l'utilisateur
   * @param bucketName - Nom du bucket S3 pour stocker les fichiers
   * @param logoUrl - URL du logo de la compagnie
   * @param authorizationUrl - URL du document d'autorisation
   * @returns ApiResponse
   */
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
          Company: {
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

  /**
   * Création de la compagnie : Etape de récupération des informations de la localisation et mise à jour de la compagnie
   * @param dto - CreateCompanyStepLocationDto
   * @param userId - ID de l'utilisateur
   * @returns ApiResponse
   */
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

  /**
   * Creation de la compagnie : Etape de récupération des Contacts et mise à jour de la compagnie
   * @param dto - CreateCompanyStepContactDto
   * @param userId - ID de l'utilisateur
   * @returns ApiResponse
   */
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

  /**
   * Creation de la compagnie : Etape de Vérification de l'email et mise à jour de la compagnie
   * @param dto - CreateCompanyStepEmailVerificationDto
   * @param userId - ID de l'utilisateur
   * @returns ApiResponse
   */
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
      return errorResponse(error);
    }
  }

  /**
   * Renvoie un email de vérification à l'utilisateur
   * @param userId - ID de l'utilisateur
   * @returns ApiResponse
   */
  async resendEmailVerification(userId: string) {
    try {
      const companyId = await this.hasCompany(userId);

      if (!companyId) {
        throw new Error('Cet utilisateur ne possède pas de compagnie.');
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

  /**
   * Valide le processus de création de la compagnie
   * @param companyId - ID de la compagnie
   * @returns ApiResponse
   */
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

  /**
   * Valide l'autorisation de création de la compagnie par le OWNER
   * @param dto - ValidateAutorizationDto
   * @returns ApiResponse
   */
  async ValidateAutorization(dto: ValidateAutorizationDto) {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id: dto.companyId },
      });

      if (!company) {
        throw new Error('Compagnie introuvable.');
      }

      const pdgRole = await this.prisma.role.findUnique({
        where: { name: 'PDG' },
      });

      if (!pdgRole) {
        throw new ForbiddenException('Rôle PDG introuvable.');
      }

      const newUser = await this.authService.register(
        {
          firstName: 'PDG',
          lastName: 'PDG',
          email: dto.validationEmail,
        },
        pdgRole.id,
      );

      if (newUser.error) {
        throw new ForbiddenException(newUser);
      }

      await this.prisma.user.update({
        where: { id: newUser.data.data.id },
        data: {
          Company: {
            connect: { id: dto.companyId },
          },
        },
      });

      return successResponse(
        'Autorisation accordée. En attente de la validation du PDG',
        201,
        newUser.data.data as UserResponse,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  /**
   * Rejet de la demande d'autorisation de création de la compagnie
   * @param dto - RejetAutorizationDto
   * @returns ApiResponse
   */
  async RejetAutorization(dto: RejetAutorizationDto) {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id: dto.companyId },
      });

      if (!company) {
        throw new Error('Compagnie introuvable.');
      }

      await this.mailService.sendMessage(company.email, dto.comment);
      await this.prisma.company.update({
        where: { id: dto.companyId },
        data: { status: CompanyStatus.REJECTED },
      });

      return successResponse('Demande de rejet effectuée', 201);
    } catch (error) {
      errorResponse(error);
    }
  }

  /**
   * Vérifie si l'utilisateur a une compagnie associée
   * @param userId - ID de l'utilisateur
   * @returns ID de la compagnie ou null si aucune compagnie n'est associée
   */
  hasCompany = async (userId: string): Promise<string | null> => {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { Company: { select: { id: true } } },
    });
    console.log('iiid', user.Company);

    return user.Company?.id ?? null;
  };

  async getCompany(companyId: string) {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        include: {
          User: {
            include: { Role: true },
          },
        },
      });

      if (!company) {
        throw new Error('Compagnie introuvable');
      }

      return successResponse('Compagnie récupérée avec succès', 200, company);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async getCompanies() {
    try {
      const companies = await this.prisma.company.findMany({
        include: {
          User: {
            include: { Role: true },
          },
        },
      });

      return successResponse('Liste des compagnies', 200, companies);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async updateCompany(id: string, data: Partial<Company>) {
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async deleteCompany(id: string) {
    return this.prisma.company.delete({
      where: { id },
    });
  }
}
