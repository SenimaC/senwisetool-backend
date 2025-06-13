import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AllPermissions } from 'src/common/constants/permissions.constant';
import { Secure } from 'src/common/decorators/secure.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AssignPermissionsDto, CreateRoleDto, UpdateRoleDto } from './role.dto';
import { RoleService } from './roles.service';

@Controller('roles')
@Secure('ACTIVE_USER', AllPermissions.ROLE_MANAGER)
@UseGuards(RolesGuard)
// @Roles('LEAD_DEVELOPER') // ⬅️ tous les endpoints doivent avoir ce rôle minimum
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiBody({ description: "Création d'un role", type: CreateRoleDto })
  createRole(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Get()
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  getRoleById(@Param('id') roleId: string) {
    return this.roleService.getRoleById(roleId);
  }

  @Patch(':id')
  updateRole(@Param('id') roleId: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.updateRole(roleId, dto);
  }

  @Delete(':id')
  deleteRole(@Param('id') roleId: string) {
    return this.roleService.deleteRole(roleId);
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Assigner des permissions à un rôle' })
  @ApiParam({
    name: 'id',
    description: 'ID du rôle',
    type: 'string',
    example: 'uuid-role',
  })
  async assignPermissions(
    @Param('id') roleId: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.roleService.assignPermissions(roleId, dto);
  }

  // permission manager
  @Post('permissions')
  @ApiBody({ description: "Création d'une permission", type: String })
  @ApiOperation({ summary: 'Créer une permission' })
  async createPermission(@Body('permission') permission: string) {
    return this.roleService.createPermission(permission);
  }

  @Patch('permissions/:id')
  @ApiParam({
    name: 'id',
    description: 'ID de la permission',
    type: 'string',
    example: 'uuid-permission',
  })
  @ApiBody({ description: "Modification d'une permission", type: String })
  @ApiOperation({ summary: 'Modifier une permission' })
  async updatePermission(
    @Param('id') id: string,
    @Body('permission') permission: string,
  ) {
    return this.roleService.updatePermission(id, permission);
  }

  @Delete('permissions/:id')
  @ApiParam({
    name: 'id',
    description: 'ID de la permission',
    type: 'string',
    example: 'uuid-permission',
  })
  @ApiOperation({ summary: 'Supprimer une permission' })
  async deletePermission(@Param('id') id: string) {
    return this.roleService.deletePermission(id);
  }

  @Get('permissions/:id')
  @ApiParam({
    name: 'id',
    description: 'ID de la permission',
    type: 'string',
    example: 'uuid-permission',
  })
  @ApiOperation({ summary: 'Récupérer une permission' })
  async getPermission(@Param('id') id: string) {
    return this.roleService.getPermission(id);
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: 'Récupérer les permissions d’un rôle' })
  @ApiParam({
    name: 'id',
    description: 'ID du rôle',
    type: 'string',
    example: 'uuid-role',
  })
  async getRolePermissions(@Param('id') roleId: string) {
    return this.roleService.getRolePermissions(roleId);
  }

  @Delete(':id/permissions')
  @ApiOperation({ summary: 'Retirer toutes les permissions d’un rôle' })
  @ApiParam({
    name: 'id',
    description: 'ID du rôle',
    type: 'string',
    example: 'uuid-role',
  })
  async removeAllPermissions(@Param('id') roleId: string) {
    return this.roleService.removeAllPermissions(roleId);
  }
}
