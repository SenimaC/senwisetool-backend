import { PrismaClient, SourceSecure } from '@prisma/client';
import { AllPermissions } from 'src/common/constants/permissions.constant';
import { RolePermissionsMap } from 'src/common/constants/role-permissions.map';
import { AllRoles } from 'src/common/constants/roles.constant';

export async function seedPermissions(prisma: PrismaClient) {
  // 📌 1. Créer toutes les permissions
  console.log('🌱 Seeding permissions...');

  await Promise.all(
    Object.values(AllPermissions).map(async (name) => {
      await prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name, from: SourceSecure.SYSTEM },
      });
    }),
  );

  const allPermissions = await prisma.permission.findMany();
  const permissionMap = Object.fromEntries(
    allPermissions.map((perm) => [perm.name, perm]),
  );

  // 📌 2. Créer tous les rôles et assigner les permissions
  console.log('🌱 Seeding roles and assigning permissions...');
  await Promise.all(
    Object.values(AllRoles).map(async (roleName) => {
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
          from: SourceSecure.SYSTEM,
          permissions: {
            connect: permissionsToAssign,
          },
        },
      });

      console.log(
        `✅ Role ${roleName} seeded with ${permissionsToAssign.length} permissions.`,
      );
    }),
  );

  console.log(
    '✅ Permissions seeded:',
    allPermissions.length + '\n permissions map:',
    permissionMap,
  );
}
