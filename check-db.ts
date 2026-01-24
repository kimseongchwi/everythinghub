import 'dotenv/config';
import prisma from './lib/prisma';

async function main() {
  try {
    const tableCheck = await (prisma as any).$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';`;
    console.log('Tables in public schema:', tableCheck);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
