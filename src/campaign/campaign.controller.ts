// campaign.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateCampaignDto } from './campaign.dto';
import { CampaignService } from './campaign.service';

@ApiTags('Campaign')
@Controller('campaigns')
@UseGuards(RolesGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @Roles('OWNER')
  create(@Body() dto: CreateCampaignDto) {
    return this.campaignService.create(dto);
  }

  @Get()
  // @Roles('OWNER')
  findAll() {
    return this.campaignService.findAll();
  }

  @Get(':id')
  // @Roles('OWNER')
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Delete(':id')
  @Roles('OWNER')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }

  @Put(':id')
  @Roles('OWNER')
  update(@Param('id') id: string, @Body() dto: CreateCampaignDto) {
    return this.campaignService.update(id, dto);
  }
}
