import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'jwt.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { S3Service } from 'src/aws/s3.service';
import { JwtUser } from 'src/common/types/user.type';
import {
  CreateCompanyStepCompanyDto,
  CreateCompanyStepContactDto,
  CreateCompanyStepEmailVerificationDto,
  CreateCompanyStepLocationDto,
} from './company.dto';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly s3Service: S3Service,
    private companyService: CompanyService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Créer une compagnie step',
    type: CreateCompanyStepCompanyDto,
  })
  async createStepCompany(
    @Body() dto: CreateCompanyStepCompanyDto,
    @UploadedFile() logo: Express.Multer.File,
    @AuthUser() user: JwtUser,
  ) {
    if (!logo || !logo.mimetype.startsWith('image/')) {
      throw new BadRequestException('Le fichier doit être une image valide.');
    }

    if (logo.size > 1 * 1024 * 1024) {
      throw new BadRequestException('Le logo ne doit pas dépasser 1MB.');
    }

    const buketName = await this.s3Service.createBucket(dto.name);

    // ✅ Upload du fichier `logo` sur S3
    const logoUrl = await this.s3Service.uploadFile(logo, buketName);

    // ✅ Enregistrement des infos avec URL S3
    return this.companyService.createStepCompany(
      dto,
      user.id,
      buketName,
      logoUrl,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/location')
  @ApiBody({
    description: 'Ajouter la localisation de la compagnie',
    type: CreateCompanyStepLocationDto,
  })
  async createStepLocation(
    @Body() dto: CreateCompanyStepLocationDto,
    @AuthUser() user: JwtUser,
  ) {
    return this.companyService.createStepLocation(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/contacts')
  @ApiBody({
    description: 'Ajouter les contacts de la compagnie',
    type: CreateCompanyStepContactDto,
  })
  async CreateStepContact(
    @Body() dto: CreateCompanyStepContactDto,
    @AuthUser() user: JwtUser,
  ) {
    return this.companyService.createStepContact(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/resend-email-verification')
  @ApiBody({
    description: "Renvoie de l'email de la compagnie",
    type: CreateCompanyStepEmailVerificationDto,
  })
  async CreateStepResendEmailVerification(
    @Body() dto: CreateCompanyStepEmailVerificationDto,
    @AuthUser() user: JwtUser,
  ) {
    return this.companyService.createStepResendEmailVerification(
      user.email,
      user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/email-verification')
  @ApiBody({
    description: "Verification de l'email de la compagnie",
    type: CreateCompanyStepEmailVerificationDto,
  })
  async CreateStepContactEmailVerificationDto(
    @Body() dto: CreateCompanyStepEmailVerificationDto,
    @AuthUser() user: JwtUser,
  ) {
    return this.companyService.createStepEmailVerification(dto, user.id);
  }
}
