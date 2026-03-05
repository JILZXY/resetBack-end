import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class StreaksSummaryUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(): Promise<{
        summary: {
            totalStreaks: number;
            activeStreaks: number;
            brokenStreaks: number;
            relapseRate: number;
        };
        averages: {
            avgDaysAll: number;
            maxDaysAll: number;
            avgDaysActive: number;
            maxDaysActive: number;
        };
        distribution: {
            '0-7': number;
            '8-14': number;
            '15-30': number;
            '31-60': number;
            '61-90': number;
            '90+': number;
        };
    }>;
}
