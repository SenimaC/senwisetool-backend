import { Module } from '@nestjs/common';
import { RequirementChapterController } from './requirement.chapter.controller';
import { RequirementController } from './requirement.controller';
import { RequirementGroupController } from './requirement.group.controller';
import { RequirementSectionController } from './requirement.section.controller';
import { RequirementService } from './requirement.service';

@Module({
  controllers: [
    RequirementController,
    RequirementGroupController,
    RequirementSectionController,
    RequirementChapterController,
  ],
  providers: [RequirementService],
  exports: [RequirementService],
})
export class RequirementModule {}
