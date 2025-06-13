import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { seedLeadeveloper } from './seed/leadeveloper.seed';
import { seedPermissions } from './seed/permissions.seed';
import { seedChapters } from './seed/requirement.chapter.seed';
import { seedGroups } from './seed/requirement.group.seed';
import { seedSections } from './seed/requirement.section.seed';
import { seedRequirements } from './seed/requirement.seed';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const prisma = app.get(PrismaService);
  const authService = app.get(AuthService);
  const config = app.get(ConfigService);

  // 📌 1. Créer toutes les permissions, rôles et assigner les permissions
  await seedPermissions(prisma);

  // 📌 3. Créer un utilisateur développeur principal s’il n’existe pas
  await seedLeadeveloper(prisma, authService, config);

  // create requirement chapters
  const chapters = await seedChapters(prisma);
  const groups = await seedGroups(prisma);
  const sections = await seedSections(prisma, chapters);
  await seedRequirements(prisma, sections, groups);

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
