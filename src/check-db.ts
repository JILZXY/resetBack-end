import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const levels = await prisma.cravingLevel.findMany();
  console.log("Craving Levels:", levels);
  
  const emotions = await prisma.emotionalState.findMany();
  console.log("Emotional States:", emotions);
}

main().then(() => prisma.$disconnect()).catch(console.error);
