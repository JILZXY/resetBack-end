import { registerAs } from '@nestjs/config';

export const brevoConfig = registerAs('brevo', () => ({
  apiKey: process.env.BREVO_API_KEY,
  fromEmail: process.env.BREVO_FROM_EMAIL,
  fromName: process.env.BREVO_FROM_NAME,
}));
