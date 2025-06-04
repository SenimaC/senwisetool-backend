import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async createRole(dto: { name: string }) {
    return this.prisma.role.create({
      data: { name: dto.name },
    });
  }

  async assignPermissions(roleId: string, dto: { permissionIds: string[] }) {
    return this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          connect: dto.permissionIds.map((id) => ({ id })),
        },
      },
    });
  }

  async getRoleById(roleId: string) {
    return this.prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: true },
    });
  }

  async getAllRoles() {
    return this.prisma.role.findMany({
      include: { permissions: true },
    });
  }

  async updateRole(roleId: string, dto: { name?: string }) {
    return this.prisma.role.update({
      where: { id: roleId },
      data: { name: dto.name },
    });
  }

  async deleteRole(roleId: string) {
    return this.prisma.role.delete({
      where: { id: roleId },
    });
  }
}
