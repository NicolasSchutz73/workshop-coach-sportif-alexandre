import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const cachePaths = [
  'node_modules/.strapi',
  '.strapi',
  '.cache',
  'dist',
];

await Promise.all(
  cachePaths.map((cachePath) =>
    rm(path.join(backendRoot, cachePath), {
      force: true,
      recursive: true,
    }),
  ),
);

console.log('Cache admin Strapi supprimé.');
