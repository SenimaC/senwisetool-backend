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
  CreateRequirementDto,
  CreateRequirementGroupDto,
  CreateRequirementSectionDto,
  UpdateRequirementChapterDto,
  UpdateRequirementDto,
  UpdateRequirementGroupDto,
  UpdateRequirementSectionDto,
} from './requirement.dto';
import { RequirementService } from './requirement.service';

@Controller('requirements')
@Roles(AllRoles.OWNER)
export class RequirementController {
  constructor(private readonly requirementService: RequirementService) {}

  // 📌 REQUIREMENTS
  @Post()
  createRequirement(@Body() dto: CreateRequirementDto) {
    return this.requirementService.createRequirement(dto);
  }

  @Get()
  getAllRequirements() {
    return this.requirementService.findRequirements();
  }

  @Get(':id')
  getRequirementById(@Param('id') id: string) {
    return this.requirementService.findRequirement(id);
  }

  @Patch(':id')
  updateRequirement(
    @Param('id') id: string,
    @Body() dto: UpdateRequirementDto,
  ) {
    return this.requirementService.updateRequirement(id, dto);
  }

  @Delete(':id')
  deleteRequirement(@Param('id') id: string) {
    return this.requirementService.deleteRequirement(id);
  }

  // 📌 REQUIREMENT GROUPS
  @Post('groups')
  createGroup(@Body() dto: CreateRequirementGroupDto) {
    return this.requirementService.createGroup(dto);
  }

  @Get('groups')
  getAllGroups() {
    return this.requirementService.findGroups();
  }

  @Get('groups/:id')
  getGroupById(@Param('id') id: string) {
    return this.requirementService.findGroup(id);
  }

  @Patch('groups/:id')
  updateGroup(@Param('id') id: string, @Body() dto: UpdateRequirementGroupDto) {
    return this.requirementService.updateGroup(id, dto);
  }

  @Delete('groups/:id')
  deleteGroup(@Param('id') id: string) {
    return this.requirementService.deleteGroup(id);
  }

  // 📌 REQUIREMENT SECTIONS
  @Post('sections')
  createSection(@Body() dto: CreateRequirementSectionDto) {
    return this.requirementService.createSection(dto);
  }

  @Get('sections')
  getAllSections() {
    return this.requirementService.findGroups();
  }

  @Get('sections/:id')
  getSectionById(@Param('id') id: string) {
    return this.requirementService.findSection(id);
  }

  @Patch('sections/:id')
  updateSection(
    @Param('id') id: string,
    @Body() dto: UpdateRequirementSectionDto,
  ) {
    return this.requirementService.updateSection(id, dto);
  }

  @Delete('sections/:id')
  deleteSection(@Param('id') id: string) {
    return this.requirementService.deleteSection(id);
  }

  // 📌 REQUIREMENT CHAPTERS
  @Post('chapters')
  createChapter(@Body() dto: CreateRequirementChapterDto) {
    return this.requirementService.createChapter(dto);
  }

  @Get('chapters')
  getAllChapters() {
    return this.requirementService.findChapters();
  }

  @Get('chapters/:id')
  getChapterById(@Param('id') id: string) {
    return this.requirementService.findChapter(id);
  }

  @Patch('chapters/:id')
  updateChapter(
    @Param('id') id: string,
    @Body() dto: UpdateRequirementChapterDto,
  ) {
    return this.requirementService.updateChapter(id, dto);
  }

  @Delete('chapters/:id')
  deleteChapter(@Param('id') id: string) {
    return this.requirementService.deleteChapter(id);
  }
}
