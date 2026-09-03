import { execSync } from 'node:child_process';
console.log('Running Prisma schema validation...');
execSync('npx prisma validate', { stdio: 'inherit' });
console.log('Prisma schema validation passed.');
