import { UserRepository } from '../infrastructure/repositories/user.repository';
import { PasswordResetTokenRepository } from '../infrastructure/repositories/password-reset-token.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { ResetPasswordDto } from '../infrastructure/dtos/reset-password.dto';
export declare class ResetPasswordUseCase {
    private readonly userRepo;
    private readonly tokenRepo;
    private readonly prisma;
    constructor(userRepo: UserRepository, tokenRepo: PasswordResetTokenRepository, prisma: PrismaService);
    execute(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
