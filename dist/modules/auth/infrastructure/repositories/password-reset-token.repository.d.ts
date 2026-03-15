import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class PasswordResetTokenRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, token: string, expiresAt: Date): Promise<any>;
    findByToken(token: string): Promise<any>;
    delete(id: string): Promise<void>;
}
