import { UserRepository } from '../infrastructure/repositories/user.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class GetProfileUseCase {
    private readonly userRepo;
    private readonly prisma;
    constructor(userRepo: UserRepository, prisma: PrismaService);
    execute(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: string | null;
        sponsorCode: string | null;
        avatarUrl: string;
        createdAt: Date;
        addiction: any;
        sponsor: any;
    }>;
}
