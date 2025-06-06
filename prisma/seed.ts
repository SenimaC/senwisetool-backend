import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const prisma = app.get(PrismaService);
  const authService = app.get(AuthService);
  const config = app.get(ConfigService);

  // ⚙️ Création des permissions
  const permissions = [
    'CREATE_OWNER',
    'CREATE_DEVELOPER',
    'VIEW_USER',
    'UPDATE_USER',
    'DELETE_USER',
    'MANAGE_USER_ROLE',
    'MANAGE_USER_STATUS',
    'RESET_USER_PASSWORD',
    'VERIFY_USER_EMAIL',
    'CREATE_COMPANY',
    'UPDATE_COMPANY',
    'DELETE_COMPANY',
    'VIEW_COMPANY',
    'MANAGE_COMPANY_STATUS',
    'MANAGE_COMPANY_AUTHORIZATION',
    'CREATE_USER_WITH_LEAD_DEVELOPER_ROLE',
    'CREATE_USER_WITH_DEVELOPER_ROLE',
    'CREATE_USER_WITH_OWNER_ROLE',
    'CREATE_USER_WITH_PDG_ROLE',
    'CREATE_USER_WITH_DG_ROLE',
    'CREATE_USER_WITH_ADG_ROLE',
    'CREATE_USER_WITH_ASSISTANT_ROLE',
  ];

  for (const name of permissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const allPermissions = await prisma.permission.findMany();

  const roles = [
    'LEAD_DEVELOPER',
    'DEVELOPER',
    'OWNER',
    'PDG',
    'DG',
    'ADG',
    'ASSISTANT',
  ];

  console.log('🌱 Seeding roles...');
  // Assigner toutes les permissions à certains rôles clés
  for (const role of roles) {
    let permissionsToAssign = [];

    switch (role) {
      case 'LEAD_DEVELOPER':
        permissionsToAssign = allPermissions;
        break;
      case 'DG':
        permissionsToAssign = allPermissions.filter((p) =>
          [
            'RESET_USER_PASSWORD',
            'VERIFY_USER_EMAIL',
            'CREATE_COMPANY',
            'UPDATE_COMPANY',
            'VIEW_COMPANY',
            'CREATE_USER_WITH_ADG_ROLE',
            'CREATE_USER_WITH_ASSISTANT_ROLE',
          ].includes(p.name),
        );
        break;

      case 'DEVELOPER':
        permissionsToAssign = allPermissions.filter(
          (p) =>
            ![
              'CREATE_OWNER',
              'CREATE_USER_WITH_LEAD_DEVELOPER_ROLE',
              'CREATE_USER_WITH_DEVELOPER_ROLE',
              'CREATE_USER_WITH_PDG_ROLE',
              'CREATE_USER_WITH_DG_ROLE',
              'CREATE_USER_WITH_ADG_ROLE',
              'CREATE_USER_WITH_ASSISTANT_ROLE',
            ].includes(p.name),
        );
        break;

      case 'OWNER':
        permissionsToAssign = allPermissions.filter(
          (p) => !['CREATE_OWNER', 'CREATE_DEVELOPER'].includes(p.name),
        );
        break;
      case 'PDG':
        permissionsToAssign = allPermissions.filter((p) =>
          [
            'VIEW_USER',
            'UPDATE_USER',
            'VIEW_COMPANY',
            'UPDATE_COMPANY',
          ].includes(p.name),
        );
        break;

      case 'ADG':
        permissionsToAssign = allPermissions.filter((p) =>
          [
            'VIEW_USER',
            'MANAGE_USER_STATUS',
            'VIEW_COMPANY',
            'MANAGE_COMPANY_STATUS',
          ].includes(p.name),
        );
        break;

      case 'ASSISTANT':
        permissionsToAssign = allPermissions.filter((p) =>
          ['VIEW_USER', 'VIEW_COMPANY'].includes(p.name),
        );
        break;

      default:
        permissionsToAssign = [];
        break;
    }

    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: {
        name: role,
        permissions: {
          connect: permissionsToAssign.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  const devRole = await prisma.role.findUnique({
    where: { name: 'LEAD_DEVELOPER' },
  });

  if (!devRole) throw new Error("Rôle 'DEVELOPER' introuvable");

  // 📩 Données de l'utilisateur développeur
  const email =
    config.get('DEVELOPER_ACCOUNT_MAIL') || 'jlove.livestyle@gmail.com';
  const firstName = config.get('DEVELOPER_USER_FIRSTNAME') || 'Kelkun';
  const lastName = config.get('DEVELOPER_USER_LASTNAME') || 'Ulrich';

  try {
    await authService.register(
      {
        email,
        firstName,
        lastName,
      },
      devRole.id,
    );

    console.log('✅ Utilisateur développeur créé avec succès via AuthService');
  } catch (error) {
    console.error(
      '❌ Erreur pendant la création de l’utilisateur développeur :',
      error,
    );
  }

  await app.close();
}

seed()
  .then(() => {
    console.log('✅ Seed terminé avec succès');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Erreur dans le seed :', err);
    process.exit(1);
  });
