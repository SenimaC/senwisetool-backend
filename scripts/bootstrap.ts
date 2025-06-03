import { execSync } from 'child_process';
import { config } from 'dotenv';

config(); // Charge les variables du .env

function runCommand(command: string) {
  console.log(`▶️ Exécution : ${command}`);
  execSync(command, { stdio: 'inherit' });
}

async function bootstrap(mode: 'init' | 'reset') {
  try {
    if (process.env.APP_ENV === 'dev') {
      if (mode === 'init') {
        runCommand('npx prisma migrate dev --name init');
      } else if (mode === 'reset') {
        runCommand('npx prisma migrate reset --force');
      }
    } else {
      runCommand('npx prisma migrate deploy');
    }

    runCommand(
      'yarn swt:add-users --email user@example.com --password secret123 --firstName John --lastName',
    );

    console.log('✅ Process complet 🎉🎉🎉');
  } catch (error) {
    console.error('❌ Erreur lors du bootstrap :', error);
    process.exit(1);
  }
}

const mode = process.argv[2];
if (mode !== 'init' && mode !== 'reset') {
  console.warn(
    '🟡 Commande rejeté : ts-node scripts/bootstrap.ts [init|reset]',
  );
  process.exit(1);
}

bootstrap(mode);

// lsof -i :5000
// kill -9 12345
