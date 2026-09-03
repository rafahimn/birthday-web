import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const schema = readFileSync(join(process.cwd(), 'prisma', 'schema.prisma'), 'utf8');
if (!schema.includes('generator client') || !schema.includes('datasource db')) {
  throw new Error('Invalid Prisma schema structure: generator/datasource block is missing.');
}
console.log('Source preflight passed. Database environment validation is deferred to runtime.');
