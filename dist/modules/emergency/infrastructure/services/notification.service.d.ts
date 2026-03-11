import { MailService } from 'src/shared/mail/mail.service';
export declare class NotificationService {
    private mailService;
    constructor(mailService: MailService);
    sendEmergencyAlert(contactEmail: string, userName: string, message?: string): Promise<void>;
    sendWelcomeEmail(userEmail: string, userName: string): Promise<void>;
}
