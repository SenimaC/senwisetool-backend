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
import { AuthGuard } from 'jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateCampaignDto } from './campaign.dto';
import { CampaignService } from './campaign.service';

@ApiTags('Campaign')
@Controller('campaigns')
@UseGuards(AuthGuard, RolesGuard)
@Roles('OWNER')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  create(@Body() dto: CreateCampaignDto) {
    return this.campaignService.create(dto);
  }

  @Get()
  findAll() {
    return this.campaignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateCampaignDto) {
    return this.campaignService.update(id, dto);
  }
}
