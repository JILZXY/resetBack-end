import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class GraduateSponsorUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(sponsorId: string, addictId: string): Promise<{
        message: string;
        addictName: string;
        sponsorCode: any;
    }>;
}
