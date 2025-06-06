import { Injectable, NotFoundException } from '@nestjs/common';
import {
  errorResponse,
  successResponse,
} from 'src/common/helpers/api-response.helper';
import { UserResponse } from 'src/common/types/user.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();
    return successResponse('Liste des utilisateurs', 200, users);
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
      errorResponse(error);
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
