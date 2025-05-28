import { randomUUID } from 'crypto';
import slugify from 'slugify';

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
