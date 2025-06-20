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
  CreateRequirementChapterDto,
  UpdateRequirementChapterDto,
} from './requirement.dto';
import { RequirementService } from './requirement.service';

@Controller('requirement-chapters')
export class RequirementChapterController {
  constructor(private readonly requirementService: RequirementService) {}

  @Post()
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  createChapter(@Body() dto: CreateRequirementChapterDto) {
    return this.requirementService.createChapter(dto);
  }

  @Get()
  @Secure('CONNECTED')
  getAllChapters() {
    return this.requirementService.findChapters();
  }

  @Get(':id')
  @Secure('CONNECTED')
  getChapterById(@Param('id') id: string) {
    return this.requirementService.findChapter(id);
  }

  @Patch(':id')
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  updateChapter(
    @Param('id') id: string,
    @Body() dto: UpdateRequirementChapterDto,
  ) {
    return this.requirementService.updateChapter(id, dto);
  }

  @Delete(':id')
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  deleteChapter(@Param('id') id: string) {
    return this.requirementService.deleteChapter(id);
  }
}
