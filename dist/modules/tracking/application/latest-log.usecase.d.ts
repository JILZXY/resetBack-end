import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class LatestLogUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(userId: string): Promise<any>;
}
