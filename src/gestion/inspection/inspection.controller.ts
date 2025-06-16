import {
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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AllPermissions } from 'src/common/constants/permissions.constant';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Secure } from 'src/common/decorators/secure.decorator';
import {
  AddInspectionLocationDto,
  CreateInspectionDto,
} from './inspection.dto';
import { InspectionService } from './inspection.service';

@ApiTags('Inspections')
@ApiBearerAuth() // 🔐 Affiche le padlock dans Swagger
@Controller('inspections')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Post()
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Créer une inspection' })
  create(@Body() dto: CreateInspectionDto, @AuthUser() user) {
    return this.inspectionService.create(dto, user.companyId);
  }

  @Patch(':id/location')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Ajouter une localisation à une inspection' })
  @ApiParam({ name: 'id', description: 'ID de l’inspection' })
  addLocation(
    @Param('id') id: string,
    @Body() dto: AddInspectionLocationDto,
    @AuthUser() user: User,
  ) {
    return this.inspectionService.addLocation(id, dto, user.id);
  }

  @Get()
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Lister toutes les inspections' })
  findAll() {
    return this.inspectionService.findAll();
  }

  @Get(':id')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Récupérer une inspection par ID' })
  @ApiParam({ name: 'id', description: 'ID de l’inspection' })
  findOne(@Param('id') id: string) {
    return this.inspectionService.findOne(id);
  }

  @Put(':id')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @ApiOperation({ summary: 'Mettre à jour une inspection' })
  @ApiParam({ name: 'id', description: 'ID de l’inspection' })
  update(@Param('id') id: string, @Body() dto: CreateInspectionDto) {
    return this.inspectionService.update(id, dto);
  }

  @Delete(':id')
  @Secure('ACTIVE_COMPANY', AllPermissions.MANAGE_INSPECTION)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une inspection' })
  @ApiParam({ name: 'id', description: 'ID de l’inspection' })
  remove(@Param('id') id: string) {
    return this.inspectionService.remove(id);
  }
}
