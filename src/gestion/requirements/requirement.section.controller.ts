import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AllRoles } from 'src/common/constants/roles.constant';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Secure } from 'src/common/decorators/secure.decorator';
import {
  CreateRequirementSectionDto,
  UpdateRequirementSectionDto,
} from './requirement.dto';
import { RequirementService } from './requirement.service';

@Controller('requirement-sections')
@Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
export class RequirementSectionController {
  constructor(private readonly requirementService: RequirementService) {}

  @Post()
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  createSection(@Body() dto: CreateRequirementSectionDto) {
    return this.requirementService.createSection(dto);
  }

  @Get()
  @Secure('CONNECTED')
  getAllSections() {
    return this.requirementService.findSections();
  }

  @Get(':id')
  @Secure('CONNECTED')
  getSectionById(@Param('id') id: string) {
    return this.requirementService.findSection(id);
  }

  @Patch(':id')
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  updateSection(
    @Param('id') id: string,
    @Body() dto: UpdateRequirementSectionDto,
  ) {
    return this.requirementService.updateSection(id, dto);
  }

  @Delete(':id')
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  deleteSection(@Param('id') id: string) {
    return this.requirementService.deleteSection(id);
  }
}
