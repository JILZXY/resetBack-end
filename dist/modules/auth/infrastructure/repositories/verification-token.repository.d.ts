import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class VerificationTokenRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, token: string, expiresAt: Date): Promise<{
        id: string;
        created_at: Date;
        user_id: string;
        token: string;
        expires_at: Date;
    }>;
    findByToken(token: string): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
            password_hash: string;
            role: import("@prisma/client").$Enums.UserRole;
            created_at: Date;
            updated_at: Date;
            sponsor_code: string | null;
            avatar_url: string;
            is_verified: boolean;
            two_factor_enabled: boolean;
            is_deleted: boolean;
            deleted_at: Date | null;
        };
    } & {
        id: string;
        created_at: Date;
        user_id: string;
        token: string;
        expires_at: Date;
    }) | null>;
    delete(id: string): Promise<void>;
}
