// campaign.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllRoles } from 'src/common/constants/roles.constant';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateCampaignDto } from './campaign.dto';
import { CampaignService } from './campaign.service';

@ApiTags('Campaign')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @Roles(AllRoles.LEAD_DEVELOPER, AllRoles.OWNER)
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
  @Roles(AllRoles.LEAD_DEVELOPER, AllRoles.OWNER)
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }

  @Put(':id')
  @Roles(AllRoles.LEAD_DEVELOPER, AllRoles.OWNER)
  update(@Param('id') id: string, @Body() dto: CreateCampaignDto) {
    return this.campaignService.update(id, dto);
  }
}
