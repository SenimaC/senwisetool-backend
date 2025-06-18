import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AllRoles } from 'src/common/constants/roles.constant';
import {
  errorResponse,
  successResponse,
} from 'src/common/helpers/api-response.helper';
import { CurrentUser, UserResponse } from 'src/common/types/user.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssistantAccountDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          Company: true,
          Role: {
            include: {
              permissions: true,
            },
          },
        },
      });

      const formattedUsers = users.map(({ Company, Role, ...userData }) => ({
        ...userData,
        company: Company,
        role: Role,
      }));

      return successResponse('Liste des utilisateurs', 200, formattedUsers);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          Company: true,
          Role: {
            include: {
              permissions: true,
            },
          },
        },
      });
      if (!user) throw new NotFoundException('Utilisateur introuvable');

      const { Company, Role, ...userData } = user;
      return successResponse("Données de l'utilisateur", 204, {
        ...userData,
        company: Company,
        role: Role,
      } as UserResponse);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          Role: true,
        },
      });

      if (!user) throw new NotFoundException('Utilisateur introuvable');

      if (user.Role.name === AllRoles.LEAD_DEVELOPER) {
        throw new UnauthorizedException(
          'Vous ne pouvez pas modifier un utilisateur avec le rôle de Lead Developer',
        );
      }

      const newUser = await this.prisma.user.update({
        where: { id },
        data: dto,
      });

      return successResponse('Utilisateur mis à jour', 200, newUser);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          Role: true,
        },
      });

      if (!user) throw new NotFoundException('Utilisateur introuvable');

      if (user.Role.name === AllRoles.LEAD_DEVELOPER) {
        throw new UnauthorizedException(
          'Vous ne pouvez pas supprimer un utilisateur avec le rôle de Lead Developer',
        );
      }

      this.prisma.user.delete({ where: { id } });

      return successResponse('Utilisateur supprimé avec succès', 200);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async createAssistantAccount(dto: AssistantAccountDto, user: CurrentUser) {
    try {
      const existingAssistant = await this.prisma.assistantAccount.findFirst({
        where: {
          email: dto.email,
          companyId: user.companyId,
        },
      });
      if (existingAssistant) {
        throw new BadRequestException(
          'Un compte assistant avec cet email existe déjà pour cette entreprise.',
        );
      }

      const hashedPassword = await this.authService.sendUserCredential(
        dto.email,
      );

      const newAccount = await this.prisma.assistantAccount.update({
        where: { id: user.id },
        data: {
          ...dto,
          password: hashedPassword,
          User: { connect: { id: user.id } },
          Company: { connect: { id: user.companyId } },
        },
      });

      return successResponse('Compte assistant créé', 200, newAccount);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async getAssistantAccounts(user: CurrentUser) {
    try {
      const assistantAccounts = await this.prisma.assistantAccount.findMany({
        where: { companyId: user.companyId },
        include: {
          User: true,
          Company: true,
          ProjectAssignment: true,
        },
      });

      return successResponse('Compte assistant créé', 200, assistantAccounts);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async getAssistantAccount(user: CurrentUser, id: string) {
    try {
      const assistantAccount = await this.prisma.assistantAccount.findUnique({
        where: { id, companyId: user.companyId },
        include: {
          User: true,
          Company: true,
          ProjectAssignment: true,
        },
      });

      return successResponse('Compte assistant créé', 200, assistantAccount);
    } catch (error) {
      return errorResponse(error);
    }
  }
}
