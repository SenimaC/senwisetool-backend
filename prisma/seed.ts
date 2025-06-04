import { PrismaClient } from '@prisma/client';
import { createUser } from '../src/common/utils/create-user.script';

const prisma = new PrismaClient();

async function main() {
  // 🔐 Permissions de gestion des utilisateurs
  const defaultPermissions = [
    'CREATE_OWNER',
    'VIEW_USER',
    'UPDATE_USER',
    'DELETE_USER',
    'MANAGE_USER_ROLE',
    'MANAGE_USER_STATUS',
    'RESET_USER_PASSWORD',
    'VERIFY_USER_EMAIL',
  ];

  for (const permission of defaultPermissions) {
    await prisma.permission.upsert({
      where: { name: permission },
      update: {},
      create: { name: permission },
    });
  }

  const allPermissions = await prisma.permission.findMany();

  // 🎭 Rôles à créer
  const defaultRoles = ['DEVELOPER', 'OWNER', 'PDG', 'DG', 'ADG', 'ASSISTANT'];

  for (const roleName of defaultRoles) {
    const permissionsToAssign =
      roleName === 'ASSISTANT'
        ? allPermissions.filter((p) => p.name === 'VIEW_USER')
        : allPermissions;

    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        permissions: {
          connect: permissionsToAssign.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  // 👤 Création de l'utilisateur développeur
  createUser({
    email: 'jlove.livestyle@gmail.com',
    firstName: 'Jean',
    lastName: 'Love',
    role: 'DEVELOPER',
  });

  console.log(
    '✅ Seed terminé avec rôles, permissions utilisateurs et compte développeur',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
