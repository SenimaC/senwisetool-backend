import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { S3Module } from 'src/aws/s3.module';
import { MailModule } from 'src/mail/mail.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [S3Module, AuthModule, MailModule],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
