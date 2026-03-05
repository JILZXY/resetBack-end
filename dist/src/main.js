"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const transform_interceptor_1 = require("./shared/interceptors/transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api/v1');
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const frontendUrls = configService.get('app.frontendUrl');
    const allowedOrigins = frontendUrls
        ? frontendUrls.split(',').map(url => url.trim())
        : [];
    app.enableCors({
        origin: allowedOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
    });
    const ioAdapter = new platform_socket_io_1.IoAdapter(app);
    app.useWebSocketAdapter(ioAdapter);
    const port = configService.get('app.port') ?? 3000;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map