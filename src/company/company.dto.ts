import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateCompanyStepCompanyDto {
  @ApiProperty({ example: 'Magnetik Inc.' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Une agence de marketing digital innovante.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Marketing Digital' })
  @IsString()
  sector: string;
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
