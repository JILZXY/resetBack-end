import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';
export declare class LogsFrequencyUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(filter: MetricsFilterDto): Promise<{
        summary: {
            totalLogs: number;
            avgLogsPerDay: number;
            logsWithConsumption: number;
            logsClean: number;
            uniqueUsersLogging: number;
        };
        daily: {
            date: Date;
            count: number;
        }[];
    }>;
}
