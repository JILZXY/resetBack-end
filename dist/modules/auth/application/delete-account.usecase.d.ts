import { UserRepository } from '../infrastructure/repositories/user.repository';
import { MailService } from 'src/shared/mail/mail.service';
export declare class DeleteAccountUseCase {
    private readonly userRepo;
    private readonly mailService;
    constructor(userRepo: UserRepository, mailService: MailService);
    execute(userId: string): Promise<{
        message: string;
    }>;
}
