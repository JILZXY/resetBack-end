import { UserRepository } from '../infrastructure/repositories/user.repository';
import { PasswordResetTokenRepository } from '../infrastructure/repositories/password-reset-token.repository';
import { MailService } from 'src/shared/mail/mail.service';
export declare class ForgotPasswordUseCase {
    private readonly userRepo;
    private readonly tokenRepo;
    private readonly mailService;
    constructor(userRepo: UserRepository, tokenRepo: PasswordResetTokenRepository, mailService: MailService);
    execute(email: string): Promise<{
        message: string;
    }>;
}
