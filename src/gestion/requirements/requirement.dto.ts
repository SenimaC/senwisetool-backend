import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// ✅ Requirement
export class CreateRequirementDto {
  @ApiProperty({ example: '1.4.2' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    example: 'Le système doit permettre à l’utilisateur de se connecter.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'e3c2d8a456e59f04b7f6979' })
  @IsString()
  @IsNotEmpty()
  sectionId: string;

  @ApiProperty({
    example: ['e3c2d8a456e59f04b7f6979', 'kbi2d8a456ea2f04l7f692r'],
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  groupIds: string[];
}

export class UpdateRequirementDto extends PartialType(CreateRequirementDto) {}

// ✅ Requirement Group
export class CreateRequirementGroupDto {
  @ApiProperty({ example: 'Groupe Authentification' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example:
      'Contient les exigences liées à l’authentification et à la gestion des sessions.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRequirementGroupDto extends PartialType(
  CreateRequirementGroupDto,
) {}

// ✅ Requirement Section
export class CreateRequirementSectionDto {
  @ApiProperty({ example: 'Section Connexion' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Exigences concernant la page et le processus de connexion.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '1.3' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'dcd8b02a9e2961d3beeb4e01' })
  @IsString()
  @IsNotEmpty()
  chapterId: string;
}

export class UpdateRequirementSectionDto extends PartialType(
  CreateRequirementSectionDto,
) {}

// ✅ Requirement Chapter
export class CreateRequirementChapterDto {
  @ApiProperty({ example: 'Chapitre Fonctionnalités Principales' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'Ce chapitre regroupe les fonctionnalités principales de l’application.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  number: number;
}

export class UpdateRequirementChapterDto extends PartialType(
  CreateRequirementChapterDto,
) {}
