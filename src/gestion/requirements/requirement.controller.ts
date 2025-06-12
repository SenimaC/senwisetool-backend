import { Controller, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Secure } from 'src/common/decorators/secure.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('requirements')
@Secure('ACTIVE_USER')
@UseGuards(RolesGuard)
@Roles('DEVELOPER', 'LEAD_DEVELOPER')
export class RequirementController {
  // constructor(private readonly requirementService: RequirementService) {}
  // @Post()
  // create(@Body() dto: CreateRequirementDto) {
  //   return this.requirementService.create(dto);
  // }
  // @Get()
  // findAll() {
  //   return this.requirementService.findAll();
  // }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.requirementService.findById(id);
  // }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateRequirementDto) {
  //   return this.requirementService.update(id, dto);
  // }
  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.requirementService.delete(id);
  // }
}
