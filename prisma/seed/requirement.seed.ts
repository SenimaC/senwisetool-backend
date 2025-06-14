import {
  PrismaClient,
  Requirement,
  RequirementGroup,
  RequirementSection,
} from '@prisma/client';

type RequirementType = {
  description?: string;
  number: string;
  groups: string[];
};

export const requirements: RequirementType[] = [
  {
    number: '1.1.1',
    description:
      'Le système doit permettre de créer un nouveau compte avec email et mot de passe.',
    groups: ['Groupe Notifications', 'Groupe Authentification'],
  },
  {
    number: '2.1.1',
    description:
      'Le système doit permettre à un utilisateur de se connecter avec ses identifiants.',
    groups: ['Groupe Interface Utilisateur', 'Groupe Notifications'],
  },
];

export async function seedRequirements(
  prisma: PrismaClient,
  sections: RequirementSection[],
  groups: RequirementGroup[],
): Promise<Requirement[]> {
  console.log('🌱 Seeding requirements...');

  const allRequirements = await Promise.all(
    requirements.map(async (requirement) => {
      const numberParts = requirement.number.split('.');
      const sectionNumber = numberParts.slice(0, -1).join('.');
      return await prisma.requirement.upsert({
        where: { number: requirement.number },
        update: {},
        create: {
          number: requirement.number,
          description: requirement.description ?? '',
          section: {
            connect: {
              id: sections.find((section) => section.number === sectionNumber)
                .id,
            },
          },
          groups: {
            connect: requirement.groups.map((groupName) => {
              const group = groups.find((g) => g.name === groupName);
              if (!group) {
                throw new Error(`"${groupName}" not found`);
              }
              return { id: group.id };
            }),
          },
        },
      });
    }),
  );

  console.log('✅ Requirements requirements seeded:', allRequirements.length);
  return allRequirements;
}
