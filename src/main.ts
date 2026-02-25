import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/filters/http-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors({
    origin: configService.get<string>('app.frontendUrl'), // Ajustar en producción con los dominios del front
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  const port = configService.get<number>('app.port') ?? 3000;
  await app.listen(port);
  console.log(`🚀 Reset API corriendo en: http://localhost:${port}/api/v1`);
}
bootstrap();