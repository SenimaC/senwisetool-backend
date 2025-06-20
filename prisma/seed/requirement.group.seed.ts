import {
  PrismaClient,
  RequirementGroup,
  RequirementGroupType,
} from '@prisma/client';
import { CreateRequirementGroupDto } from '../../src/gestion/requirements/requirement.dto';

const requirementGroups: CreateRequirementGroupDto[] = [
  {
    name: 'Petites exploitations agricoles',
    description: '',
    type: RequirementGroupType.GROUP_CERTIFICATION,
  },
  {
    name: 'Grandes exploitations agricoles',
    description: '',
    type: RequirementGroupType.GROUP_CERTIFICATION,
  },
  {
    name: 'Direction du groupe',
    description: '',
    type: RequirementGroupType.GROUP_CERTIFICATION,
  },
  {
    name: 'Petites/Grandes exploitations agricoles',
    description: '',
    type: RequirementGroupType.INDIVIDUAL_CERTIFICATION,
  },
  {
    name: 'Systeme de gestion interne (SGI)',
    description: '',
    type: RequirementGroupType.INDIVIDUAL_CERTIFICATION,
  },
];

export async function seedGroups(
  prisma: PrismaClient,
): Promise<RequirementGroup[]> {
  console.log('🌱 Seeding requirements groups...');

  const groups = await Promise.all(
    requirementGroups.map(async (group) => {
      return await prisma.requirementGroup.upsert({
        where: { name: group.name },
        update: {},
        create: group,
      });
    }),
  );

  console.log('✅ Requirements groups seeded:', groups.length);
  return groups;
}
