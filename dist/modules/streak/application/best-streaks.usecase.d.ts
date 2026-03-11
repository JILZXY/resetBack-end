import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class BestStreaksUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(userId: string): Promise<any[]>;
}
