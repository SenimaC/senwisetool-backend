import { PrismaClient, RequirementGroup } from '@prisma/client';
import { CreateRequirementGroupDto } from '../../src/gestion/requirements/requirement.dto';

const requirementGroups: CreateRequirementGroupDto[] = [
  {
    name: 'Groupe Authentification',
    description: 'Exigences liées à la sécurité et authentification.',
  },
  {
    name: 'Groupe Interface Utilisateur',
    description: 'Concernant les éléments d’UI et UX.',
  },
  {
    name: 'Groupe Notifications',
    description: 'Emails, alertes et messages système.',
  },
];

export async function seedGroups(
  prisma: PrismaClient,
): Promise<RequirementGroup[]> {
  console.log('🌱 Seeding requirements groups...');

  const groups = await Promise.all(
    requirementGroups.map(async (group) => {
      return await prisma.requirementGroup.create({
        data: { ...group },
      });
    }),
  );

  console.log('✅ Requirements groups seeded:', groups.length);
  return groups;
}
