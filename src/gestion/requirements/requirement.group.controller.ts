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
  CreateRequirementGroupDto,
  UpdateRequirementGroupDto,
} from './requirement.dto';
import { RequirementService } from './requirement.service';

@Controller('requirement-groups')
export class RequirementGroupController {
  constructor(private readonly requirementService: RequirementService) {}

  @Post()
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  createGroup(@Body() dto: CreateRequirementGroupDto) {
    return this.requirementService.createGroup(dto);
  }

  @Get()
  @Secure('CONNECTED')
  getAllGroups() {
    return this.requirementService.findGroups();
  }

  @Get(':id')
  @Secure('CONNECTED')
  getGroupById(@Param('id') id: string) {
    return this.requirementService.findGroup(id);
  }

  @Patch(':id')
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  updateGroup(@Param('id') id: string, @Body() dto: UpdateRequirementGroupDto) {
    return this.requirementService.updateGroup(id, dto);
  }

  @Delete(':id')
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  deleteGroup(@Param('id') id: string) {
    return this.requirementService.deleteGroup(id);
  }
}
