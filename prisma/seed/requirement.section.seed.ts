import {
  PrismaClient,
  RequirementChapter,
  RequirementSection,
} from '@prisma/client';

type RequirementSectionType = {
  title: string;
  description?: string;
  number: string;
};

const requirementSections: RequirementSectionType[] = [
  {
    title: 'Section Création de compte',
    description:
      'Exigences liées à la création d’un nouveau compte utilisateur.',
    number: '1.1',
  },
  {
    title: 'Section Connexion',
    description: 'Décrit les conditions de connexion au système.',
    number: '2.1',
  },
];

export async function seedSections(
  prisma: PrismaClient,
  chapters: RequirementChapter[],
): Promise<RequirementSection[]> {
  console.log('🌱 Seeding Requirement sections...');

  const sections = await Promise.all(
    requirementSections.map(async (section) => {
      return await prisma.requirementSection.create({
        data: {
          ...section,
          chapter: {
            connect: {
              id: chapters.find(
                (chapter) =>
                  chapter.number === parseInt(section.number.split('.')[0]),
              ).id,
            },
          },
        },
      });
    }),
  );

  console.log('✅ Requirements sections seeded:', sections.length);
  return sections;
}
