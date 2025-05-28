import { Module } from '@nestjs/common';
import { S3Module } from 'src/aws/s3.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [S3Module],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
