import { Module } from '@nestjs/common';
import { S3Module } from 'src/aws/s3.module';
import { InspectionController } from './inspection.controller';
import { InspectionService } from './inspection.service';

@Module({
  imports: [S3Module],
  controllers: [InspectionController],
  providers: [InspectionService],
  exports: [InspectionService], // facultatif
})
export class InspectionModule {}
