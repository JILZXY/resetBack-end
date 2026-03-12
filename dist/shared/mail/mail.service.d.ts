import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, htmlContent: string): Promise<void>;
    getBaseTemplate(title: string, content: string): string;
    getPrimaryFrontendUrl(): string;
    sendVerificationEmail(to: string, token: string): Promise<void>;
    sendPasswordReset(to: string, token: string): Promise<void>;
    sendFarewellEmail(to: string, userName: string): Promise<void>;
}
