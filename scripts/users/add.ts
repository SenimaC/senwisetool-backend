import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import { config } from 'dotenv';
import fs from 'fs';
import * as http from 'http';
import path from 'path';
import { RegisterWithScriptDto } from 'src/user/user.dto';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

config(); // Charge les variables du .env
const serverProcess: ReturnType<typeof spawn> | null = null;

const prisma = new PrismaClient();

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

function getArgv() {
  return (
    yargs(hideBin(process.argv))
      .options({
        file: { type: 'string', describe: 'Fichier JSON', demandOption: false },
        email: { type: 'string', describe: 'Email', demandOption: false },
        firstName: { type: 'string', describe: 'Prénom', demandOption: false },
        lastName: { type: 'string', describe: 'Nom', demandOption: false },
        role: { type: 'string', describe: 'Rôle', demandOption: false },
      })
      // .strict()
      .help()
      .parseSync()
  ); // 👈 version synchronisée, typée
}

export async function createUser(dto: RegisterWithScriptDto) {
  console.log("Creation d'un nouvel utilisateur ...");

  const data = JSON.stringify({
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    role: dto.role,
  });

  const hostname = process.env.HOSTNAME || 'localhost';
  const port = parseInt(process.env.PORT || '5000', 10);
  const requestPath =
    process.env.REGISTER_SCRIPT_PATH || '/auth/register-with-script';

  const options = {
    hostname,
    port,
    path: requestPath,
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
    stopServer();
  });
}

async function main() {
  const argv = getArgv();
  console.log(argv);

  if (argv.file) {
    console.log(argv.file);
    const filePath = path.resolve(process.cwd(), argv.file); // <-- chemin absolu

    const rawData = fs.readFileSync(filePath, 'utf-8');
    // 📂 Mode fichier
    // const raw = fs.readFileSync(argv.file, 'utf-8');
    const users = JSON.parse(rawData) as RegisterWithScriptDto[];

    for (const user of users) {
      await createUser(user);
      console.log(`✅ Utilisateur créé : ${user.email}`);
    }
  } else if (argv.email && argv.firstName && argv.lastName) {
    // 📦 Mode individuel
    await createUser(argv as RegisterWithScriptDto);
    console.log(`✅ Utilisateur créé : ${argv.email}`);
  } else {
    console.error(
      '❌ Veuillez soit spécifier --file=chemin.json, soit fournir --email, --password, --firstName, --lastName',
    );
    process.exit(1);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('❌ Erreur :', err);
  prisma.$disconnect();
  process.exit(1);
});
