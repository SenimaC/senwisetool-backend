import { Injectable, NotFoundException } from '@nestjs/common';
import {
  errorResponse,
  successResponse,
} from 'src/common/helpers/api-response.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateRequirementChapterDto,
  CreateRequirementDto,
  CreateRequirementGroupDto,
  CreateRequirementSectionDto,
  UpdateRequirementChapterDto,
  UpdateRequirementDto,
  UpdateRequirementGroupDto,
  UpdateRequirementSectionDto,
} from './requirement.dto';

@Injectable()
export class RequirementService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CHAPTER
  async createChapter(dto: CreateRequirementChapterDto) {
    try {
      const newChapter = await this.prisma.requirementChapter.create({
        data: dto,
      });

      return successResponse('Chapter created successfully', 201, newChapter);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async findChapters() {
    try {
      const chapters = await this.prisma.requirementChapter.findMany({
        include: {
          sections: {
            include: {
              requirements: {
                include: {
                  groups: true,
                },
              },
            },
          },
        },
      });

      return successResponse('Chapters retrieved successfully', 200, chapters);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async findChapter(id: string) {
    try {
      const chapters = await this.prisma.requirementChapter.findUnique({
        where: { id },
        include: {
          sections: {
            include: {
              requirements: {
                include: {
                  groups: true,
                },
              },
            },
          },
        },
      });

      return successResponse('Chapters retrieved successfully', 200, chapters);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async updateChapter(id: string, dto: UpdateRequirementChapterDto) {
    try {
      const chapterUpdated = await this.prisma.requirementChapter.update({
        where: { id },
        data: dto,
      });

      return successResponse(
        'Chapter updated successfully',
        200,
        chapterUpdated,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async deleteChapter(id: string) {
    try {
      const chapterDeleted = await this.prisma.requirementChapter.delete({
        where: { id },
      });

      return successResponse(
        'Chapter deleted successfully',
        200,
        chapterDeleted,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  // ✅ SECTION
  async createSection(dto: CreateRequirementSectionDto) {
    try {
      await this.ensureChapterExists(dto.chapterId);
      const newSection = await this.prisma.requirementSection.create({
        data: dto,
      });

      return successResponse('Section created successfully', 201, newSection);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async findSections() {
    try {
      const sections = await this.prisma.requirementSection.findMany({
        include: {
          chapter: true,
          requirements: {
            include: {
              groups: true,
            },
          },
        },
      });

      return successResponse('Sections retrieved successfully', 200, sections);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async findSection(id: string) {
    try {
      const sections = await this.prisma.requirementSection.findUnique({
        where: { id },
        include: {
          chapter: true,
          requirements: {
            include: {
              groups: true,
            },
          },
        },
      });

      return successResponse('Sections retrieved successfully', 200, sections);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async updateSection(id: string, dto: UpdateRequirementSectionDto) {
    try {
      const sectionUpdated = await this.prisma.requirementSection.update({
        where: { id },
        data: dto,
      });

      return successResponse(
        'Section updated successfully',
        200,
        sectionUpdated,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async deleteSection(id: string) {
    try {
      const sectionDeleted = await this.prisma.requirementSection.delete({
        where: { id },
      });

      return successResponse(
        'Section deleted successfully',
        200,
        sectionDeleted,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  // ✅ REQUIREMENT
  async createRequirement(dto: CreateRequirementDto) {
    try {
      await this.ensureSectionExists(dto.sectionId);
      const newRequirement = await this.prisma.requirement.create({
        data: {
          ...dto,
          groups: { connect: [] },
        },
      });

      return successResponse(
        'Requirement created successfully',
        201,
        newRequirement,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async findRequirements() {
    try {
      const requirements = await this.prisma.requirement.findMany({
        include: {
          section: true,
          groups: true,
        },
      });

      return successResponse(
        'Requirements retrieved successfully',
        200,
        requirements,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async findRequirement(id: string) {
    try {
      const requirements = await this.prisma.requirement.findUnique({
        where: { id },
        include: {
          section: true,
          groups: true,
        },
      });

      return successResponse(
        'Requirements retrieved successfully',
        200,
        requirements,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async updateRequirement(id: string, dto: UpdateRequirementDto) {
    try {
      const requirementUpdated = await this.prisma.requirement.update({
        where: { id },
        data: dto,
      });

      return successResponse(
        'Requirement updated successfully',
        200,
        requirementUpdated,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async deleteRequirement(id: string) {
    try {
      const requirementDeleted = await this.prisma.requirement.delete({
        where: { id },
      });

      return successResponse(
        'Requirement deleted successfully',
        200,
        requirementDeleted,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  // ✅ GROUP
  async createGroup(dto: CreateRequirementGroupDto) {
    try {
      const newGroup = await this.prisma.requirementGroup.create({
        data: dto,
      });

      return successResponse(
        'Requirement group created successfully',
        201,
        newGroup,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async findGroups() {
    try {
      const groups = await this.prisma.requirementGroup.findMany({
        include: {
          requirements: true,
        },
      });
      console.log('groups : ', groups);

      return successResponse('Groups retrieved successfully', 200, groups);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async findGroup(id: string) {
    try {
      const group = await this.prisma.requirementGroup.findUnique({
        where: { id },
        include: {
          requirements: true,
        },
      });

      return successResponse('Groups retrieved successfully', 200, group);
    } catch (error) {
      return errorResponse(error);
    }
  }

  async updateGroup(id: string, dto: UpdateRequirementGroupDto) {
    try {
      const groupUpdated = await this.prisma.requirementGroup.update({
        where: { id },
        data: dto,
      });

      return successResponse(
        'Requirement group updated successfully',
        200,
        groupUpdated,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async deleteGroup(id: string) {
    try {
      const groupDeleted = await this.prisma.requirementGroup.delete({
        where: { id },
      });

      return successResponse(
        'Requirement group deleted successfully',
        200,
        groupDeleted,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  // ✅ Utilities
  private async ensureChapterExists(id: string) {
    const chapter = await this.prisma.requirementChapter.findUnique({
      where: { id },
    });
    if (!chapter) throw new NotFoundException('Chapter not found');
  }

  private async ensureSectionExists(id: string) {
    const section = await this.prisma.requirementSection.findUnique({
      where: { id },
    });
    if (!section) throw new NotFoundException('Section not found');
  }
}
