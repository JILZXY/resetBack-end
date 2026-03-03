import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const pool = new Pool({
    connectionString: "postgresql://postgres:qwerty123@137.184.39.253:5432/reset",
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({
    adapter,
  });

  try {
    const existing = await prisma.user.findUnique({ where: { email: 'test@test.com' } });
    console.log("Existing:", existing);
    if (!existing) {
      const created = await prisma.user.create({
        data: {
          name: 'test',
          email: 'test@test.com',
          password_hash: 'hashed',
          role: 'patient',
          addictions: {
            create: {
              custom_name: 'Alcohol',
              classification: 'Substance'
            }
          }
        },
        include: { addictions: true }
      });
      console.log("Created:", created);
    }
  } catch (e) {
    console.error("PRISMA ERROR:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
