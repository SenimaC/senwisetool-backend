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
    title: 'Gestion',
    description: '',
    number: '1.1',
  },
  {
    title: 'Administration',
    description: '',
    number: '1.2',
  },
  {
    title: 'Évaluation des risques et Plan de gestion',
    description: '',
    number: '1.3',
  },
  {
    title: 'Inspection Interne et Auto-Évaluation',
    description: '',
    number: '1.4',
  },
  {
    title: 'Mécanisme de Réclamation',
    description: '',
    number: '1.5',
  },
  {
    title: 'Égalité des Genres',
    description: '',
    number: '1.6',
  },
  {
    title: 'Les données de l’indicateus',
    description: '',
    number: '1.7',
  },
  {
    title: 'Traçabilité',
    description: '',
    number: '2.1',
  },
  {
    title: 'Traçabilité sur la plateforme en ligne',
    description: '',
    number: '2.2',
  },
  {
    title: 'Bilan Massique',
    description: '',
    number: '2.3',
  },
  {
    title: 'Prime',
    description: '',
    number: '3.1',
  },
  {
    title: 'Plantation et Rotation',
    description: '',
    number: '4.1',
  },
  {
    title: 'Taille, élagage et rénovation des plantations d’arbres',
    description: '',
    number: '4.2',
  },
  {
    title: 'Organismes Génétiquement Modifiés (OGM)',
    description: '',
    number: '4.3',
  },
  {
    title: 'Conservation et Fertilité des Sols',
    description: '',
    number: '4.4',
  },
  {
    title: 'Lutte Intégrée contre les Ravageurs (LIR)',
    description: '',
    number: '4.5',
  },
  {
    title: 'Gestion des produits agrochimiques',
    description: '',
    number: '4.6',
  },
  {
    title: 'Pratiques de Récoltes et Post-Récoltes',
    description: '',
    number: '4.7',
  },
  {
    title:
      'Évaluation et Résolution du travail des enfants, du travail forcé, de la discrimination, de la violence et du harcèlement sur le lieu de travail',
    description: '',
    number: '5.1',
  },
  {
    title: 'Liberté d’Association et de Convention Collective',
    description: '',
    number: '5.2',
  },
  {
    title: 'Salaires et Contrats',
    description: '',
    number: '5.3',
  },
  {
    title: 'Salaire Minimum Vital',
    description: '',
    number: '5.4',
  },
  {
    title: 'Conditions de Travail',
    description: '',
    number: '5.5',
  },
  {
    title: 'Santé et Sécurité',
    description: '',
    number: '5.6',
  },
  {
    title: 'Conditions de Vie et de Logement',
    description: '',
    number: '5.7',
  },
  {
    title: 'Communautés',
    description: '',
    number: '5.8',
  },
  {
    title: 'Forêts, autres écosystèmes naturels et aires protégées',
    description: '',
    number: '6.1',
  },
  {
    title:
      'Conservation et Amélioration des Écosystèmes Naturels et de la Végétation Naturelle',
    description: '',
    number: '6.2',
  },
  {
    title: 'Zones Ripariennes Tampons',
    description: '',
    number: '6.3',
  },
  {
    title: 'Protection de la Faune Sauvage et de la Biodiversité',
    description: '',
    number: '6.4',
  },
  {
    title: 'Conservation et Gestion de L’Eau',
    description: '',
    number: '6.5',
  },
  {
    title: 'Gestion et eaux usées',
    description: '',
    number: '6.6',
  },
  {
    title: 'Gestion des Déchets',
    description: '',
    number: '6.7',
  },
  {
    title: 'Efficacité Énergétique',
    description: '',
    number: '6.8',
  },
];

export async function seedSections(
  prisma: PrismaClient,
  chapters: RequirementChapter[],
): Promise<RequirementSection[]> {
  console.log('🌱 Seeding Requirement sections...');

  const sections = await Promise.all(
    requirementSections.map(async (section) => {
      return await prisma.requirementSection.upsert({
        where: { number: section.number },
        update: {},
        create: {
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
