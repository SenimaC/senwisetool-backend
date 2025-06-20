import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssistantRole } from '@prisma/client';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Jean' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class AuthRegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '152fie885e9u',
    description: 'Id du role',
  })
  @IsOptional()
  @IsString()
  role?: string;
}

export class RegisterWithScriptDto {
  @ApiProperty({ example: 'Jean' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '152fie885e9u',
    description: 'Id du role',
  })
  @IsOptional()
  @IsString()
  role?: string;
}

export class RegisterPDGDto {
  @ApiProperty({ example: 'Jean' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '152fie885e9u' })
  @IsString()
  companyId: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  password: string;
}

export class resendEmailVerificationDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '678945' })
  @IsString()
  @Length(6, 6)
  code: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciIkpXVCJ9.eyJzdWIiOiJjbWI2NnRkMWkwMDAnFuejRoNDJnIiwiaWF04MzMwNDY4LCJleHAiE3NDgzOiJIUzI1NiIsInR5cCI6MzA3Njh9.9rbC22agjjfgBH6btlNCWdiSsXIjoxNzQOnpkvwOHAzYc5B8n',
  })
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  newPassword: string;
}

export class ValidateAccountDto {
  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  currentPassword: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  newPassword: string;
}

// User DTO

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

export class AssistantAccountDto {
  @ApiProperty({ example: 'assistant@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+237612345678' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  /**
   * The role assigned to the assistant.
   *
   * Possible values:
   * - 'MENDATAIRE': Represents a mandatary.
   * - 'AGENT': Represents an agent.
   * - 'INSPECTOR': Represents an inspector.
   * - 'TRAINER': Represents a trainer.
   */
  @ApiPropertyOptional({ example: 'AGENT', description: "Role de l'assistant" })
  @IsOptional()
  @IsString()
  role?: AssistantRole;
}
