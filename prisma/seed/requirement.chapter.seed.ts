import { PrismaClient, RequirementChapter } from '@prisma/client';
import { CreateRequirementChapterDto } from '../../src/gestion/requirements/requirement.dto';

const requirementChapters: CreateRequirementChapterDto[] = [
  {
    title: 'Gestion',
    description:
      'Gestion : Ce chapitre couvre la gestion organisationnelle, administrative, l’évaluation des risques, l’auto-évaluation, les mécanismes de réclamation, l’égalité des genres et l’implication des jeunes travailleurs.',
    number: 1,
  },
  {
    title: 'Traçabilité',
    description:
      'Traçabilité : Ce chapitre traite de la traçabilité des produits, du suivi des volumes certifiés, de la plateforme en ligne et du bilan massique.',
    number: 2,
  },
  {
    title: 'Revenu et responsabilité partagées',
    description:
      'Revenu et responsabilité partagées : Ce chapitre aborde les coûts de production, le revenu vital, le différentiel de durabilité et les investissements pour la durabilité.',
    number: 3,
  },
  {
    title: 'Agriculture',
    description:
      'Agriculture : Ce chapitre regroupe les exigences sur la plantation, la rotation, la gestion des sols, la lutte intégrée contre les ravageurs, la gestion des produits agrochimiques et les pratiques de récolte.',
    number: 4,
  },
  {
    title: 'Social',
    description:
      'Social : Ce chapitre couvre les aspects sociaux, y compris le travail des enfants, la discrimination, la liberté d’association, les salaires, la santé et sécurité, les conditions de logement et les relations avec les communautés.',
    number: 5,
  },
  {
    title: 'Environnement',
    description:
      'Environnement : Ce chapitre traite de la protection des forêts, de la biodiversité, de la gestion de l’eau, des déchets, de l’efficacité énergétique et de la réduction des gaz à effet de serre.',
    number: 6,
  },
];

export async function seedChapters(
  prisma: PrismaClient,
): Promise<RequirementChapter[]> {
  console.log('🌱 Seeding requirements chapters...');

  const chapters = await Promise.all(
    requirementChapters.map(async (chapter) => {
      return await prisma.requirementChapter.upsert({
        where: { number: chapter.number },
        update: {},
        create: chapter,
      });
    }),
  );

  console.log('✅ Requirements Chapters seeded:', chapters.length);
  return chapters;
}
