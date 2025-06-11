// dto/create-campaign.dto.ts
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum CampaignStatus {
  CURRENT = 'CURRENT',
  FINISHED = 'FINISHED',
}

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;
}
