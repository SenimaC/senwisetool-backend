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
import { CreateRequirementDto, UpdateRequirementDto } from './requirement.dto';
import { RequirementService } from './requirement.service';

@Controller('requirements')
export class RequirementController {
  constructor(private readonly requirementService: RequirementService) {}

  // 📌 REQUIREMENTS
  @Post()
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  createRequirement(@Body() dto: CreateRequirementDto) {
    return this.requirementService.createRequirement(dto);
  }

  @Get()
  @Secure('CONNECTED')
  getAllRequirements() {
    return this.requirementService.findRequirements();
  }

  @Get(':id')
  @Secure('CONNECTED')
  getRequirementById(@Param('id') id: string) {
    return this.requirementService.findRequirement(id);
  }

  @Patch(':id')
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  updateRequirement(
    @Param('id') id: string,
    @Body() dto: UpdateRequirementDto,
  ) {
    return this.requirementService.updateRequirement(id, dto);
  }

  @Delete(':id')
  @Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
  deleteRequirement(@Param('id') id: string) {
    return this.requirementService.deleteRequirement(id);
  }
}
