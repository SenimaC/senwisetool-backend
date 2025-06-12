import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRequirementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  challengeId: string;
}

export class UpdateRequirementDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
