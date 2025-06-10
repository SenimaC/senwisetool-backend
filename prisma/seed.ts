import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AllPermissions } from 'src/common/constants/permissions.constant';
import { RolePermissionsMap } from 'src/common/constants/role-permissions.map';
import { AllRoles } from 'src/common/constants/roles.constant';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const prisma = app.get(PrismaService);
  const authService = app.get(AuthService);
  const config = app.get(ConfigService);

  // 📌 1. Créer toutes les permissions
  console.log('🌱 Seeding permissions...');
  for (const name of Object.values(AllPermissions)) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const allPermissions = await prisma.permission.findMany();
  const permissionMap = Object.fromEntries(
    allPermissions.map((perm) => [perm.name, perm]),
  );

  // 📌 2. Créer tous les rôles et assigner les permissions
  console.log('🌱 Seeding roles and assigning permissions...');
  for (const roleName of Object.values(AllRoles)) {
    const rolePermissions = RolePermissionsMap[roleName] || [];

    const permissionsToAssign = rolePermissions.map((permName) => ({
      id: permissionMap[permName].id,
    }));

    await prisma.role.upsert({
      where: { name: roleName },
      update: {
        permissions: {
          set: [], // clean previous
          connect: permissionsToAssign,
        },
      },
      create: {
        name: roleName,
        permissions: {
          connect: permissionsToAssign,
        },
      },
    });

    console.log(
      `✅ Role ${roleName} seeded with ${permissionsToAssign.length} permissions.`,
    );
  }

  // 📌 3. Créer un utilisateur développeur principal s’il n’existe pas
  const leaDevRole = await prisma.role.findUnique({
    where: { name: AllRoles.LEAD_DEVELOPER },
  });

  if (!leaDevRole) {
    throw new Error('❌ Rôle LEAD_DEVELOPER introuvable');
  }

  const existingLeadDev = await prisma.user.findFirst({
    where: { roleId: leaDevRole.id },
  });

  if (!existingLeadDev) {
    const email =
      config.get('DEVELOPER_ACCOUNT_MAIL') || 'jlove.livestyle@gmail.com';
    const firstName = config.get('DEVELOPER_USER_FIRSTNAME') || 'Kelkun';
    const lastName = config.get('DEVELOPER_USER_LASTNAME') || 'Ulrich';

    try {
      await authService.register({ email, firstName, lastName }, leaDevRole.id);
      console.log('✅ développeur principal créé.');
    } catch (error) {
      console.error(
        '❌ Erreur lors de la création du développeur principal :',
        error,
      );
    }
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
