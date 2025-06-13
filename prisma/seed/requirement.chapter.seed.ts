import { PrismaClient, RequirementChapter } from '@prisma/client';
import { CreateRequirementChapterDto } from '../../src/gestion/requirements/requirement.dto';

const requirementChapters: CreateRequirementChapterDto[] = [
  {
    title: 'Chapitre 1 - Gestion des utilisateurs',
    description:
      'Ce chapitre couvre les fonctionnalités liées à la gestion des comptes utilisateurs.',
    number: 1,
  },
  {
    title: 'Chapitre 2 - Authentification et sécurité',
    description:
      'Comprend les exigences de connexion, sécurité et permissions.',
    number: 2,
  },
  {
    title: 'Chapitre 3 - Interface utilisateur',
    description: 'Décrit les exigences relatives à l’expérience utilisateur.',
    number: 3,
  },
  {
    title: 'Chapitre 4 - Base de données',
    description: 'Inclut la gestion des données persistantes.',
    number: 4,
  },
  {
    title: 'Chapitre 5 - Performances',
    number: 5,
  },
  {
    title: 'Chapitre 6 - Notifications',
    description: 'Gestion des notifications email et en temps réel.',
    number: 6,
  },
  {
    title: 'Chapitre 7 - Gestion des rôles',
    description: 'Définit les différents rôles utilisateurs.',
    number: 7,
  },
  {
    title: 'Chapitre 8 - Journalisation',
    description: 'Suivi des actions utilisateurs pour audit.',
    number: 8,
  },
  {
    title: 'Chapitre 9 - API',
    description: 'Spécifications pour les points de terminaison API.',
    number: 9,
  },
  {
    title: 'Chapitre 10 - Tests & Qualité',
    description: 'Exigences pour garantir la qualité du code.',
    number: 10,
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
