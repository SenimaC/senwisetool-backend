import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SourceSecure } from '@prisma/client';
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
        data: { ...dto },
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

      if (role.from === SourceSecure.SYSTEM)
        throw new UnauthorizedException(
          'Vous ne pouvez pas modifier un rôle système',
        );

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

      if (role.from === SourceSecure.SYSTEM)
        throw new UnauthorizedException(
          'Vous ne pouvez pas supprimer un rôle système',
        );

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

  // permission management
  async createPermission(permission: string) {
    try {
      if (!permission || typeof permission !== 'string' || !permission.trim()) {
        throw new Error(
          'Permission name is required and must be a non-empty string',
        );
      }
      const existing = await this.prisma.permission.findUnique({
        where: { name: permission.trim() },
      });
      if (existing) {
        throw new Error(`Permission "${permission}" already exists`);
      }
      const newPermission = await this.prisma.permission.create({
        data: { name: permission.trim() },
      });
      return successResponse(
        'Permission created successfully',
        201,
        newPermission,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async updatePermission(id: string, permission: string) {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Permission ID is required');
      }
      if (!permission || typeof permission !== 'string' || !permission.trim()) {
        throw new Error(
          'Permission name is required and must be a non-empty string',
        );
      }

      const existing = await this.prisma.permission.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }
      const nameExists = await this.prisma.permission.findUnique({
        where: { name: permission.trim() },
      });

      if (existing.from === SourceSecure.SYSTEM)
        throw new UnauthorizedException(
          'Vous ne pouvez pas modifier une permission système',
        );

      if (nameExists && nameExists.id !== id) {
        throw new Error(`Permission name "${permission}" already exists`);
      }
      const updated = await this.prisma.permission.update({
        where: { id },
        data: { name: permission.trim() },
      });

      return successResponse('Permission updated successfully', 200, updated);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async deletePermission(id: string) {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Permission ID is required');
      }
      const existing = await this.prisma.permission.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      if (existing.from === SourceSecure.SYSTEM)
        throw new UnauthorizedException(
          'Vous ne pouvez pas modifier une permission système',
        );

      await this.prisma.permission.delete({ where: { id } });
      return successResponse('Permission deleted successfully', 200, null);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async getPermissions() {
    try {
      const permissions = await this.prisma.permission.findMany({
        include: {
          roles: true,
        },
      });

      return successResponse(
        'Permissions retrieved successfully',
        200,
        permissions,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async getPermission(id: string) {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Permission ID is required');
      }
      const permission = await this.prisma.permission.findUnique({
        where: { id },
      });
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }
      return successResponse(
        'Permission retrieved successfully',
        200,
        permission,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async getRolePermissions(roleId: string) {
    try {
      if (!roleId || typeof roleId !== 'string') {
        throw new Error('Role ID is required');
      }
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
        include: { permissions: true },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }
      return successResponse(
        'Role permissions retrieved successfully',
        200,
        role.permissions,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async removeAllPermissions(roleId: string) {
    try {
      if (!roleId || typeof roleId !== 'string') {
        throw new Error('Role ID is required');
      }
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
        include: { permissions: true },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }
      await this.prisma.role.update({
        where: { id: roleId },
        data: { permissions: { set: [] } },
      });
      return successResponse('All permissions removed from role', 200, null);
    } catch (error) {
      return errorResponse(error);
    }
  }
}
