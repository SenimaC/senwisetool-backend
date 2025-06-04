import { spawn } from 'child_process';
import { config } from 'dotenv';
import * as http from 'http';
import { RegisterWithScriptDto } from 'src/user/user.dto';

config(); // Charge les variables du .env
const serverProcess: ReturnType<typeof spawn> | null = null;

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
