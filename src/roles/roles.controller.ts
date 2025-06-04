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
import { Roles } from 'src/common/decorators/developer.decorator';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { AssignPermissionsDto, CreateRoleDto, UpdateRoleDto } from './role.dto';
import { RoleService } from './roles.service';

@Controller('roles')
@UseGuards(RoleGuard)
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles('DEVELOPER')
  createRole(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Get()
  @Roles('DEVELOPER')
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  @Roles('DEVELOPER')
  getRoleById(@Param('id') roleId: string) {
    return this.roleService.getRoleById(roleId);
  }

  @Patch(':id')
  @Roles('DEVELOPER')
  updateRole(@Param('id') roleId: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.updateRole(roleId, dto);
  }

  @Delete(':id')
  @Roles('DEVELOPER')
  deleteRole(@Param('id') roleId: string) {
    return this.roleService.deleteRole(roleId);
  }

  @Roles('DEVELOPER')
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
