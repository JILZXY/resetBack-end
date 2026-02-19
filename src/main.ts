import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ZodValidationPipe } from './shared/pipes/zod-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global de API
  app.setGlobalPrefix('api/v1');

  // CORS — en producción restringe el origin al dominio del front
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://tu-dominio-front.com']
      : '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Filtro global de errores con formato estándar
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Reset Backend corriendo en puerto ${process.env.PORT ?? 3000}`);
}
bootstrap();