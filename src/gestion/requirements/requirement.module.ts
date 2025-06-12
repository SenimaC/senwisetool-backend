import { Module } from '@nestjs/common';
import { RequirementController } from './requirement.controller';

@Module({
  controllers: [RequirementController],
})
export class RequirementModule {}
