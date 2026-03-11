import { UserRepository } from '../infrastructure/repositories/user.repository';
import { RegisterDto } from '../infrastructure/dtos/register.dto';
import { VerificationTokenRepository } from '../infrastructure/repositories/verification-token.repository';
import { MailService } from 'src/shared/mail/mail.service';
export declare class RegisterUserUseCase {
    private readonly userRepo;
    private readonly tokenRepo;
    private readonly mailService;
    constructor(userRepo: UserRepository, tokenRepo: VerificationTokenRepository, mailService: MailService);
    execute(dto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: string | null;
        sponsorCode: string | null;
        avatarUrl: string;
        createdAt: Date;
    }>;
}
