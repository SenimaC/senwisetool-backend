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
  CreateRequirementGroupDto,
  UpdateRequirementGroupDto,
} from './requirement.dto';
import { RequirementService } from './requirement.service';

@Controller('requirement-groups')
@Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
export class RequirementGroupController {
  constructor(private readonly requirementService: RequirementService) {}

  @Post()
  createGroup(@Body() dto: CreateRequirementGroupDto) {
    return this.requirementService.createGroup(dto);
  }

  @Get()
  getAllGroups() {
    return this.requirementService.findGroups();
  }

  @Get(':id')
  getGroupById(@Param('id') id: string) {
    return this.requirementService.findGroup(id);
  }

  @Patch(':id')
  updateGroup(@Param('id') id: string, @Body() dto: UpdateRequirementGroupDto) {
    return this.requirementService.updateGroup(id, dto);
  }

  @Delete(':id')
  deleteGroup(@Param('id') id: string) {
    return this.requirementService.deleteGroup(id);
  }
}
