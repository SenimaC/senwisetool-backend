import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './aws/s3.module';
import { CampaignController } from './campaign/campaign.controller';
import { CampaignModule } from './campaign/campaign.module';
import { CampaignService } from './campaign/campaign.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CompanyModule } from './company/company.module';
import { InspectionController } from './gestion/inspection/inspection.controller';
import { InspectionModule } from './gestion/inspection/inspection.module';
import { RequirementModule } from './gestion/requirements/requirement.module';
import { RequirementService } from './gestion/requirements/requirement.service';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    CompanyModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RolesModule,
    CampaignModule,
    RequirementModule,
    InspectionModule,
    S3Module,
  ],
  controllers: [AppController, CampaignController, InspectionController],
  providers: [AppService, CampaignService, RequirementService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
