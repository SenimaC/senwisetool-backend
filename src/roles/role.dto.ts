import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'The name of the role', example: 'Admin' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the role',
    example: 'Administrator role',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'Admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'A brief description of the role',
    example: 'Administrator role',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class RoleDto {
  @ApiProperty({
    description: 'The unique identifier of the role',
    example: '1',
  })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The name of the role', example: 'Admin' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the role',
    example: 'Administrator role',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'Liste des IDs des permissions à assigner au rôle',
    type: [String],
    example: ['a12b3c4d-5678-90ef-gh12-3456789ijklm'],
  })
  @IsArray()
  permissionIds: string[];
}
