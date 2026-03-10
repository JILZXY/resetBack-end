import { DailyLogRepository } from '../infrastructure/repositories/daily-log.repository';
import { SponsorshipRepository } from '../../sponsorship/infrastructure/repositories/sponsorship.repository';
export declare class GetStatisticsUseCase {
    private readonly logRepo;
    private readonly sponsorRepo;
    constructor(logRepo: DailyLogRepository, sponsorRepo: SponsorshipRepository);
    execute(userId: string, requestedUserId?: string): Promise<{
        dayCounter: any;
        averageCraving: any;
        averageEmotionalState: any;
        streakStatus: any;
        totalRelapses: any;
    }>;
}
