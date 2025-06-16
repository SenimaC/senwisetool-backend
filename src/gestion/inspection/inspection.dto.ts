import { ApiProperty } from '@nestjs/swagger';
import { InspectionType } from '@prisma/client';
import { IsArray, IsDateString, IsEnum, IsString } from 'class-validator';

export class CreateInspectionDto {
  @ApiProperty({
    description: 'Titre de l’inspection',
    example: 'Inspection initiale des infrastructures sanitaires',
  })
  @IsString()
  title: string;

  @ApiProperty({
    enum: InspectionType,
    default: InspectionType.INITIAL,
    description: 'Type de l’inspection (INITIAL ou INTERNAL)',
  })
  @IsEnum(InspectionType)
  type: InspectionType;

  @ApiProperty({
    description: 'Secteur d’activité concerné par l’inspection',
    example: 'Santé publique',
  })
  @IsString()
  activitySector: string;

  @ApiProperty({
    description: 'Date de début de l’inspection (ISO 8601)',
    example: '2025-07-01T08:00:00.000Z',
  })
  @IsDateString()
  startAt: string;

  @ApiProperty({
    description: 'Date de fin de l’inspection (ISO 8601)',
    example: '2025-07-15T17:00:00.000Z',
  })
  @IsDateString()
  endAt: string;

  @ApiProperty({
    description: 'Description détaillée de l’inspection',
    example:
      'Cette inspection a pour but d’évaluer les installations sanitaires...',
  })
  @IsString()
  description: string;
}

export class AddInspectionLocationDto {
  @ApiProperty({
    description: 'Pays dans lequel se déroule l’inspection',
    example: 'Cameroun',
  })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Région concernée',
    example: 'Centre',
  })
  @IsString()
  region: string;

  @ApiProperty({
    description: 'Ville concernée',
    example: 'Yaoundé',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Adresse complète',
    example: 'Avenue Kennedy, immeuble XYZ',
  })
  @IsString()
  address: string;
}

export class InspectionRequirementsDto {
  @ApiProperty({
    description: 'Liste des IDs des exigences associées à cette inspection',
    example: ['id-req-1234567890', 'id-req-0987654321'],
    type: [String],
  })
  @IsArray()
  requirements?: string[];
}
