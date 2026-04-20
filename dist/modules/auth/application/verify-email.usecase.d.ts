import { UserRepository } from '../infrastructure/repositories/user.repository';
import { VerificationTokenRepository } from '../infrastructure/repositories/verification-token.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class VerifyEmailUseCase {
    private readonly userRepo;
    private readonly tokenRepo;
    private readonly prisma;
    constructor(userRepo: UserRepository, tokenRepo: VerificationTokenRepository, prisma: PrismaService);
    execute(token: string): Promise<{
        message: string;
    }>;
}
