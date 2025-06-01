import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateCompanyStepInitDto {
  @ApiProperty({ example: 'Magnetik Inc.' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Cacao' })
  @IsString()
  sector: string;

  @ApiProperty({ example: 'Compagnie de production du cacao.' })
  @IsString()
  description: string;
}

export class CreateCompanyStepLocationDto {
  @ApiPropertyOptional({ example: 'Cameroun' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'Centre' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ example: 'Yaoundé' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Rue 204, Bastos' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class CreateCompanyStepContactDto {
  @ApiProperty({ example: 'contact@magnetik.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+237699112233' })
  @IsString()
  phoneNumber: string;
}

export class CreateCompanyStepEmailVerificationDto {
  @ApiProperty({ example: '678945' })
  @IsString()
  @Length(6, 6)
  code: string;
}

export class ValidateAutorizationDto {
  @ApiProperty({ example: 'Jean' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '152fie885e9u' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  validationEmail: string;

  @ApiProperty({ example: 'contact@companymail.com' })
  @IsEmail()
  companyEmail: string;
}

export class RejetAutorizationDto {
  @ApiProperty({ example: '152fie885e9u' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'contact@companymail.com' })
  @IsEmail()
  companyEmail: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  compagnyEmailUser: string;

  @ApiProperty({ example: '152fie885e9u' })
  @IsString()
  comment: string;
}
