import { PrismaClient } from '@prisma/client';

export let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    if (process.env.NODE_ENV === 'dev') {
      global.prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
    }
    if (process.env.NODE_ENV === 'test') {
      global.prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.TEST_DATABASE_URL,
          },
        },
      });
    }
  }
  prisma = global.prisma;
}

prisma.$on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
