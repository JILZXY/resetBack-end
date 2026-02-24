// prisma.config.ts
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.development' });

export default {
  connection: {
    url: process.env.DATABASE_URL,
  },
};
