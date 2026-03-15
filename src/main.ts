import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/filters/http-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const frontendUrls = configService.get<string>('app.frontendUrl');
  const allowedOrigins = frontendUrls
    ? frontendUrls.split(',').map((url) => url.trim())
    : [];
    
  const corsOrigin = allowedOrigins.length > 0 ? allowedOrigins : true;

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
  });

  // Configurar WebSocket adapter (socket.io) con los mismos orígenes permitidos
  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  const port = configService.get<number>('app.port') ?? 3000;

  await app.listen(port);
}
bootstrap();
