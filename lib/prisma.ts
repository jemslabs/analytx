import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client/client';

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_POOL_URL 
});
export const prisma = new PrismaClient({ adapter }); 