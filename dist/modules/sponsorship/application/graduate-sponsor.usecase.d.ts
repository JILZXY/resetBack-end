import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class GraduateSponsorUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(userId: string): Promise<{
        message: string;
        sponsorCode: any;
    }>;
}
