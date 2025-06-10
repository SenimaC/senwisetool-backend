import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Company } from '@prisma/client';
import { AuthGuard } from 'jwt.guard';
import { S3Service } from 'src/aws/s3.service';
import { AllPermissions } from 'src/common/constants/permissions.constant';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/common/guards/Permissions.guard';
import { UserRole } from 'src/common/types/user.type';
import {
  CreateCompanyStepContactDto,
  CreateCompanyStepEmailVerificationDto,
  CreateCompanyStepInitDto,
  CreateCompanyStepLocationDto,
  RejetAutorizationDto,
  ValidateAutorizationDto,
} from './company.dto';
import { CompanyService } from './company.service';

@UseGuards(AuthGuard, PermissionsGuard)
@Controller('company')
export class CompanyController {
  constructor(
    private readonly s3Service: S3Service,
    private companyService: CompanyService,
  ) {}

  @Post('create')
  @Permissions(AllPermissions.CREATE_COMPANY)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'authorization', maxCount: 1 },
    ]),
  ) // ≤ 2 fichiers : [logo, authorization]
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Créer une compagnie (logo + autorisation)',
    type: CreateCompanyStepInitDto,
  })
  async createStepCompany(
    @Body() dto: CreateCompanyStepInitDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      authorization?: Express.Multer.File[];
    },
    @AuthUser() user,
  ) {
    // Validation du logo
    const logo = files.logo?.[0];

    if (!logo) {
      throw new BadRequestException('Le logo est obligatoire.');
    }

    if (!logo || !logo.mimetype.startsWith('image/')) {
      throw new BadRequestException('Le logo doit être une image valide.');
    }

    if (logo.size > 2 * 1024 * 1024) {
      throw new BadRequestException('Le logo ne doit pas dépasser 2MB.');
    }

    // Validation du document d'autorisation
    const authorization = files.authorization?.[0];

    if (!authorization) {
      throw new BadRequestException(
        'Le document d’autorisation est obligatoire.',
      );
    }

    if (!authorization || !authorization.mimetype.includes('pdf')) {
      throw new BadRequestException(
        'Le document d’autorisation doit être un PDF.',
      );
    }

    const bucketName = await this.s3Service.createBucket(dto.name);

    const logoUrl = await this.s3Service.uploadFile(logo, bucketName);
    const authorizationUrl = await this.s3Service.uploadFile(
      authorization,
      bucketName,
    );

    return this.companyService.createStepCompany(
      dto,
      user.id,
      bucketName,
      logoUrl,
      authorizationUrl,
    );
  }

  @Post('create/location')
  @Permissions(AllPermissions.CREATE_COMPANY)
  @ApiBody({
    description: 'Ajouter la localisation de la compagnie',
    type: CreateCompanyStepLocationDto,
  })
  async createStepLocation(
    @Body() dto: CreateCompanyStepLocationDto,
    @AuthUser() user,
  ) {
    return this.companyService.createStepLocation(dto, user.id);
  }

  @Post('create/contact')
  @Permissions(AllPermissions.CREATE_COMPANY)
  @ApiBody({
    description: 'Ajouter les contacts de la compagnie',
    type: CreateCompanyStepContactDto,
  })
  async CreateStepContact(
    @Body() dto: CreateCompanyStepContactDto,
    @AuthUser() user,
  ) {
    return this.companyService.createStepContact(dto, user.id);
  }

  @Post('create/resend-email-verification')
  @Permissions(AllPermissions.CREATE_COMPANY)
  @ApiBody({
    description: "Renvoie de l'email de la compagnie",
  })
  async resendEmailVerification(@AuthUser() user) {
    return this.companyService.resendEmailVerification(user.id);
  }

  @Post('create/email-verification')
  @Permissions(AllPermissions.CREATE_COMPANY)
  @ApiBody({
    description: "Verification de l'email de la compagnie",
    type: CreateCompanyStepEmailVerificationDto,
  })
  async CreateStepContactEmailVerification(
    @Body() dto: CreateCompanyStepEmailVerificationDto,
    @AuthUser() user,
  ) {
    return this.companyService.createStepEmailVerification(dto, user.id);
  }

  @Post('validate-authorization')
  @Permissions(AllPermissions.VALIDATE_COMPANY)
  @ApiBody({
    description: "Valider la demande d'autorisation de création la compagnie",
    type: ValidateAutorizationDto,
  })
  async ValidateAutorizationDto(@Body() dto: ValidateAutorizationDto) {
    return this.companyService.ValidateAutorization(dto);
  }

  @Post('rejet-authorization')
  @Permissions(AllPermissions.REJET_COMPANY)
  @ApiBody({
    description: "rejeter la demande d'autorisation de création la compagnie",
    type: RejetAutorizationDto,
  })
  async RejetAutorizationDto(
    @Body() dto: RejetAutorizationDto,
    @AuthUser() user,
  ) {
    if (user.role !== UserRole.OWNER)
      throw new UnauthorizedException('Accès refusé');

    return this.companyService.RejetAutorization(dto);
  }

  // gestion des compagnies *********************

  @Get(':id')
  @Permissions(AllPermissions.VIEW_COMPANY)
  getCompany(@Param('id') id: string) {
    return this.companyService.getCompany(id);
  }

  @Get('me')
  @Permissions(AllPermissions.VIEW_COMPANY)
  getSelfCompany(@AuthUser() user) {
    const id = user.companyId;
    if (!id) {
      throw new BadRequestException("Vous n'avez pas de compagnie associée.");
    }
    return this.companyService.getCompany(id);
  }

  @Get()
  @Permissions(AllPermissions.VIEW_COMPANY)
  getCompanies() {
    return this.companyService.getCompanies();
  }

  @Patch('me')
  @Permissions(AllPermissions.UPDATE_SELF_COMPANY)
  updateCompany(@AuthUser() user, @Body() data: Partial<Company>) {
    if (!user.companyId) {
      throw new BadRequestException("Vous n'avez pas de compagnie associée.");
    }
    return this.companyService.updateCompany(user.companyId, data);
  }

  @Delete(':id')
  @Permissions(AllPermissions.DELETE_COMPANY)
  deleteCompany(@Param('id') id: string) {
    return this.companyService.deleteCompany(id);
  }
}
