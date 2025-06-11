// dto/create-campaign.dto.ts
import { IsDateString, IsOptional, IsString } from 'class-validator';

export enum CampaignStatus {
  CURRENT = 'CURRENT',
  FINISHED = 'FINISHED',
}

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
