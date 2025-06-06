import { randomUUID } from 'crypto';
import slugify from 'slugify';

export const generateSecurePassword = (
  minLength: number = 20,
  maxLength: number = 50,
): string => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const all = upper + lower + digits + symbols;

  // Longueur dynamique entre minLength et maxLength
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  const password = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  // Remplir le reste avec des caractères aléatoires
  for (let i = password.length; i < length; i++) {
    password.push(all[Math.floor(Math.random() * all.length)]);
  }

  // Mélanger les caractères
  return password.sort(() => Math.random() - 0.5).join('');
};

export const generate6DigitCode: string = Math.floor(
  100000 + Math.random() * 900000,
).toString();

export const uniqueString = (string: string) => {
  let name = string;
  let ext = '';

  // Extraire extension si elle existe
  const lastDotIndex = string.lastIndexOf('.');
  if (lastDotIndex !== -1 && lastDotIndex !== 0) {
    name = string.slice(0, lastDotIndex);
    ext = string.slice(lastDotIndex + 1);
  }

  // Slugifier le nom
  const safeName = slugify(name, {
    lower: true,
    strict: true,
  });

  // Générer le nom unique
  const base = `${Date.now()}-${randomUUID()}-${safeName}`;

  // Retourner avec ou sans extension
  return ext ? `${base}.${ext}` : base;
};
