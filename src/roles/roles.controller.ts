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
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AssignPermissionsDto, CreateRoleDto, UpdateRoleDto } from './role.dto';
import { RoleService } from './roles.service';

@Controller('roles')
@UseGuards(AuthGuard, RolesGuard)
@Roles('DEVELOPER', 'LEAD_DEVELOPER') // ⬅️ tous les endpoints doivent avoir ce rôle minimum
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
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
}
