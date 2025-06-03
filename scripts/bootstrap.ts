import { execSync, spawn } from 'child_process';
import { config } from 'dotenv';
// import http from 'http';
import * as http from 'http';

config(); // Charge les variables du .env
const serverProcess: ReturnType<typeof spawn> | null = null;

function runCommand(command: string) {
  console.log(`▶️ Exécution : ${command}`);
  execSync(command, { stdio: 'inherit' });
}

function startServer() {
  console.log('Demarrage du server ...');

  return new Promise<void>((resolve, reject) => {
    const serverProcess = spawn('yarn', ['start'], {
      stdio: 'ignore', // ⛔️ pas bloquant
      shell: true,
      detached: true, // ✅ le processus est indépendant
    });

    serverProcess.unref(); // ✅ libère le process principal immédiatement

    // Attendre un peu pour lui laisser le temps de démarrer (ou appeler waitForAppReady ensuite)
    serverProcess.on('error', reject);
    setTimeout(resolve, 3000);
    console.log('🟢 Serveur démarré');
  });
}

function stopServer() {
  if (serverProcess && serverProcess.pid) {
    try {
      console.log(`🛑 Killing server process PID ${serverProcess.pid}`);
      process.kill(serverProcess.pid, 'SIGKILL');
    } catch (err) {
      console.error('⚠️ Impossible de tuer le serveur lancé :', err);
    }
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForAppReady(url: string, retries = 15, delay = 2000) {
  console.log(`⏳ Test de connexion sur l'application depuis ${url}`);

  for (let i = 0; i < retries; i++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(`Statut: ${res.statusCode}`);
          }
        });

        req.on('error', (err) => reject(err.message));
      });

      console.log('🟢 Connexion établie');
      return;
    } catch (err) {
      console.log(`🕐 Tentative ${i + 1} échouée : ${err}`);
      await wait(delay);
    }
  }

  console.error('❌ L’application n’est pas prête après plusieurs tentatives.');
  process.exit(1);
}

async function registerDefaultUser() {
  const firstName = process.env.DEVELOPER_USER_FIRSTNAME || 'developer team';
  const lastName = process.env.DEVELOPER_USER_LASTNAME || 'swt';
  const email = process.env.DEVELOPER_ACCOUNT_MAIL || '';
  const role = process.env.DEVELOPER_USER_ROLE || 'DEVELOPER';
  // const password = generateSecurePassword();

  console.log('Création du compte develloppeur ...');

  const data = JSON.stringify({
    email,
    firstName,
    lastName,
    role,
  });

  const hostname = process.env.BOOTSTRAP_HOSTNAME || 'localhost';
  const port = parseInt(process.env.BOOTSTRAP_PORT || '5000', 10);
  const path =
    process.env.BOOTSTRAP_REGISTER_PATH || '/auth/register-with-script';

  const options = {
    hostname,
    port,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'x-internal-secret': process.env.JWT_SECRET || '',
    },
  };

  return new Promise<void>((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        console.log(responseBody);
        resolve();
      });
      console.log('🟢 Utilisateur créé');
    });

    req.on('error', (e) => {
      console.error(
        '❌ Erreur pendant la création du compte dévelloppeur :',
        e.message,
      );
      reject(e);
    });

    req.write(data);
    req.end();
  });
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

    const readyUrl = `http://${process.env.BOOTSTRAP_HOSTNAME}:${process.env.BOOTSTRAP_PORT}`;

    await startServer();
    await waitForAppReady(readyUrl);
    await registerDefaultUser();

    stopServer();
    console.log('✅ Process complet 🎉🎉🎉');
  } catch (error) {
    console.error('❌ Erreur lors du bootstrap :', error);
    if (serverProcess) stopServer(); // on le tue même en cas d’erreur
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
