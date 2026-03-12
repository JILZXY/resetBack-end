import { ConfigService } from '@nestjs/config';
export declare class NotificationService {
    private config;
    private isConfigured;
    constructor(config: ConfigService);
    sendEmergencyAlert(contactEmail: string, userName: string, message?: string): Promise<void>;
    sendWelcomeEmail(userEmail: string, userName: string): Promise<void>;
}
