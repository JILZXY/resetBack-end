import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    healthCheck() {
        return {
            success: true,
            message: 'Reset API is running',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
        };
    }
}
