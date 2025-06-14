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
import {
  CreateRequirementChapterDto,
  UpdateRequirementChapterDto,
} from './requirement.dto';
import { RequirementService } from './requirement.service';

@Controller('requirement-chapters')
@Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
export class RequirementChapterController {
  constructor(private readonly requirementService: RequirementService) {}

  @Post()
  createChapter(@Body() dto: CreateRequirementChapterDto) {
    return this.requirementService.createChapter(dto);
  }

  @Get()
  getAllChapters() {
    return this.requirementService.findChapters();
  }

  @Get(':id')
  getChapterById(@Param('id') id: string) {
    return this.requirementService.findChapter(id);
  }

  @Patch(':id')
  updateChapter(
    @Param('id') id: string,
    @Body() dto: UpdateRequirementChapterDto,
  ) {
    return this.requirementService.updateChapter(id, dto);
  }

  @Delete(':id')
  deleteChapter(@Param('id') id: string) {
    return this.requirementService.deleteChapter(id);
  }
}
