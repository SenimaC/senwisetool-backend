import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

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
  @ApiProperty({ example: 'Cameroun' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Centre' })
  @IsString()
  region: string;

  @ApiProperty({ example: 'Yaoundé' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Rue 204, Bastos' })
  @IsString()
  address: string;
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
  @ApiProperty({ example: '152fie885e9u' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  validationEmail: string;
}

export class RejetAutorizationDto {
  @ApiProperty({ example: '152fie885e9u' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  compagnyEmailUser: string;

  @ApiProperty({ example: '152fie885e9u' })
  @IsString()
  comment: string;
}
