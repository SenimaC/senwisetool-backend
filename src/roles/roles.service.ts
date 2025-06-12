import { Injectable, NotFoundException } from '@nestjs/common';
import {
  errorResponse,
  successResponse,
} from 'src/common/helpers/api-response.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async createRole(dto: CreateRoleDto) {
    try {
      const existingRole = await this.prisma.role.findUnique({
        where: { name: dto.name },
      });
      if (existingRole) {
        throw new Error(`Role with name ${dto.name} already exists`);
      }

      const newRole = await this.prisma.role.create({
        data: { name: dto.name },
      });

      return successResponse('Role created successfully', 201, newRole);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async assignPermissions(roleId: string, dto: { permissionIds: string[] }) {
    try {
      const newAssign = await this.prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            connect: dto.permissionIds.map((id) => ({ id })),
          },
        },
      });

      return successResponse(
        'Permissions assigned successfully',
        201,
        newAssign,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async getRoleById(roleId: string) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
        include: { permissions: true },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }

      return successResponse('Role retrieved successfully', 200, role);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async getAllRoles() {
    try {
      const roles = await this.prisma.role.findMany({
        include: { permissions: true },
      });
      return successResponse('Roles retrieved successfully', 200, roles);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async updateRole(roleId: string, dto: { name?: string }) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }

      const updatedRole = await this.prisma.role.update({
        where: { id: roleId },
        data: {
          name: dto.name ?? role.name, // Only update if a new name is provided
        },
      });

      return successResponse('Role updated successfully', 200, updatedRole);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async deleteRole(roleId: string) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }

      await this.prisma.role.delete({
        where: { id: roleId },
      });

      return successResponse('Role deleted successfully', 200, null);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async getRoleByName(name: string) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { name },
        include: { permissions: true },
      });
      if (!role) {
        throw new NotFoundException(`Role with name ${name} not found`);
      }

      return successResponse('Role retrieved successfully', 200, role);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async findByNames(names: string[]) {
    try {
      const roles = await this.prisma.role.findMany({
        where: {
          name: {
            in: names,
          },
        },
        include: { permissions: true },
      });
      if (roles.length === 0) {
        throw new NotFoundException(
          `No roles found for names: ${names.join(', ')}`,
        );
      }

      return successResponse('Roles retrieved successfully', 200, roles);
    } catch (error) {
      return errorResponse(error);
    }
  }
}
