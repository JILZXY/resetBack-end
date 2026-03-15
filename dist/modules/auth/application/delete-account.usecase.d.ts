import { UserRepository } from '../infrastructure/repositories/user.repository';
import { MailService } from 'src/shared/mail/mail.service';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class DeleteAccountUseCase {
    private readonly userRepo;
    private readonly mailService;
    private readonly prisma;
    constructor(userRepo: UserRepository, mailService: MailService, prisma: PrismaService);
    execute(userId: string): Promise<{
        message: string;
    }>;
}
