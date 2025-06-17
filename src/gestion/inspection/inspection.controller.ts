import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { S3Service } from 'src/aws/s3.service';
import { AllPermissions } from 'src/common/constants/permissions.constant';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Secure } from 'src/common/decorators/secure.decorator';
import { CurrentUser } from 'src/common/types/user.type';
import {
  AddInspectionLocationDto,
  CreateInspectionDto,
  InspectionRequirementsDto,
} from './inspection.dto';
import { InspectionService } from './inspection.service';

@ApiTags('Inspections')
@ApiBearerAuth() // 🔐 Affiche le padlock dans Swagger
@Controller('inspections')
export class InspectionController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly inspectionService: InspectionService,
  ) {}

  @Post()
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Créer une inspection' })
  create(@Body() dto: CreateInspectionDto, @AuthUser() user: CurrentUser) {
    return this.inspectionService.create(dto, user);
  }

  @Patch(':id/location')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Ajouter une localisation à une inspection' })
  @ApiParam({ name: 'id', description: 'ID de l’inspection' })
  addLocation(
    @Param('id') id: string,
    @Body() dto: AddInspectionLocationDto,
    @AuthUser() user: CurrentUser,
  ) {
    return this.inspectionService.addLocation(id, dto, user);
  }

  @Patch(':id/partners')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logos', maxCount: 10 }]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Uploader les logos de partenaires (max 10, images uniquement, 2MB max chacun)',
  })
  async partnersLogos(
    @UploadedFiles()
    files: {
      logos?: Express.Multer.File[];
    },
    @Param('id') id: string,
    @AuthUser() user: CurrentUser,
  ) {
    const logos = files.logos;

    if (!logos || logos.length === 0)
      throw new BadRequestException('Au moins un logo est obligatoire.');

    for (const logo of logos) {
      if (!logo.mimetype.startsWith('image/')) {
        throw new BadRequestException(
          'Tous les logos doivent être des images valides.',
        );
      }
      if (logo.size > 2 * 1024 * 1024) {
        throw new BadRequestException('Chaque logo ne doit pas dépasser 2MB.');
      }
    }

    this.inspectionService.isInspectionManager(user.Role.name, user.companyId);

    const bucketName = user.Company.bucketName;
    const logoUrls: string[] = [];

    for (const logo of logos) {
      const url = await this.s3Service.uploadFile(
        logo,
        bucketName,
        'partnersLogos',
      );
      logoUrls.push(url);
    }

    return this.inspectionService.partnersLogos(id, user.id, logoUrls);
  }

  @Patch(':id/requirements')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Ajouter des requirements' })
  @ApiParam({ name: 'id', description: 'ID de l’inspection' })
  requirements(
    @Param('id') id: string,
    @Body() dto: InspectionRequirementsDto,
    @AuthUser() user: CurrentUser,
  ) {
    return this.inspectionService.requirements(id, dto, user);
  }

  @Patch(':id/validate-creation')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Ajouter des requirements' })
  @ApiParam({ name: 'id', description: 'ID de l’inspection' })
  validateCreation(@Param('id') id: string, @AuthUser() user: CurrentUser) {
    return this.inspectionService.validateCreation(id, user);
  }

  @Patch(':id/publish')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Ajouter des requirements' })
  @ApiParam({ name: 'id', description: 'ID de l’inspection' })
  deploy(@Param('id') id: string, @AuthUser() user: CurrentUser) {
    return this.inspectionService.publish(id, user);
  }

  @Get()
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Lister toutes les inspections' })
  findAll(@AuthUser() user: CurrentUser) {
    return this.inspectionService.findAll(user.companyId);
  }

  @Get(':id')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Récupérer une inspection par ID' })
  @ApiParam({ name: 'id', description: 'ID de l’inspection' })
  findOne(@Param('id') id: string, @AuthUser() user: CurrentUser) {
    return this.inspectionService.findOne(id, user.companyId);
  }

  @Put(':id')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Mettre à jour une inspection' })
  @ApiParam({ name: 'id', description: 'ID de l’inspection' })
  update(
    @Param('id') id: string,
    @AuthUser() user: CurrentUser,
    @Body()
    dto: Partial<CreateInspectionDto> | Partial<AddInspectionLocationDto>,
  ) {
    return this.inspectionService.update(id, user, dto);
  }

  @Delete(':id')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une inspection' })
  @ApiParam({ name: 'id', description: 'ID de l’inspection' })
  remove(@Param('id') id: string, @AuthUser() user: CurrentUser) {
    return this.inspectionService.remove(id, user);
  }
}
