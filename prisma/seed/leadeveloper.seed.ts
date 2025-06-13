import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { AllRoles } from 'src/common/constants/roles.constant';

export async function seedLeadeveloper(
  prisma: PrismaClient,
  authService: AuthService,
  config: ConfigService,
) {
  // 📌 1. Créer toutes les permissions
  console.log('🌱 Seeding lead developer...');

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
}
