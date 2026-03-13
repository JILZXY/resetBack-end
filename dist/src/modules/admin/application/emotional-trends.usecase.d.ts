import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';
export declare class EmotionalTrendsUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(filter: MetricsFilterDto): Promise<{
        global: {
            avgCraving: number | null;
            avgEmotion: number | null;
            totalLogs: number;
        };
        daily: {
            date: string;
            avgCraving: number | null;
            avgEmotion: number | null;
            logCount: number;
        }[];
        cravingDistribution: {
            level: number;
            count: number;
        }[];
        emotionDistribution: {
            level: number;
            count: number;
        }[];
    }>;
}
