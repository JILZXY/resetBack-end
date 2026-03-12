import { CreateLogUseCase } from './application/create-log.usecase';
import { GetLogHistoryUseCase } from './application/get-log-history.usecase';
import { GetStatisticsUseCase } from './application/get-statistics.usecase';
import { LatestLogUseCase } from './application/latest-log.usecase';
import { MovingAverageUseCase } from './application/moving-average.usecase';
import { CreateLogDto } from './infrastructure/dtos/create-log.dto';
import { LogFilterDto } from './infrastructure/dtos/log-filter.dto';
export declare class TrackingController {
    private readonly createLog;
    private readonly getHistory;
    private readonly getStats;
    private readonly latestLog;
    private readonly movingAverage;
    constructor(createLog: CreateLogUseCase, getHistory: GetLogHistoryUseCase, getStats: GetStatisticsUseCase, latestLog: LatestLogUseCase, movingAverage: MovingAverageUseCase);
    create(req: any, dto: CreateLogDto): Promise<import("./domain/daily-log.entity").DailyLogEntity>;
    history(req: any, filter: LogFilterDto, requestedUserId?: string): Promise<import("./domain/daily-log.entity").DailyLogEntity[]>;
    statistics(req: any, requestedUserId?: string): Promise<{
        dayCounter: any;
        averageCraving: any;
        averageEmotionalState: any;
        streakStatus: any;
        totalRelapses: any;
    }>;
    latest(req: any): Promise<any>;
    movingAvg(req: any): Promise<any[]>;
}
