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

  const frontendUrls = configService.get<string>('app.frontendUrl');
  const origins = frontendUrls
    ? frontendUrls.split(',').map(url => url.trim())
    : [];

  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: '*',
  });

  const port = configService.get<number>('app.port') ?? 3000;
  console.log(`🚀 Servidor listo en: http://0.0.0.0:${port}/api/v1`);
  console.log(`🔗 Orígenes CORS permitidos: ${origins.join(', ')}`);

  await app.listen(port, '0.0.0.0');
}
bootstrap();