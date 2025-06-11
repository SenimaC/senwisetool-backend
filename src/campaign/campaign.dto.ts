// dto/create-campaign.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export enum CampaignStatus {
  CURRENT = 'CURRENT',
  FINISHED = 'FINISHED',
}

export class CreateCampaignDto {
  @ApiProperty({ example: 'Summer Promo 2024' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'A campaign to boost summer sales.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-08-31T23:59:59.000Z' })
  @IsDateString()
  endDate: string;
}
