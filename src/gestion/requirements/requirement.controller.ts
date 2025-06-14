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
import { CreateRequirementDto, UpdateRequirementDto } from './requirement.dto';
import { RequirementService } from './requirement.service';

@Controller('requirements')
@Roles(AllRoles.OWNER, AllRoles.LEAD_DEVELOPER)
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
}
