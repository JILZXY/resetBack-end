import { DailyLogRepository } from '../infrastructure/repositories/daily-log.repository';
import { SponsorshipRepository } from '../../sponsorship/infrastructure/repositories/sponsorship.repository';
import { LogFilterDto } from '../infrastructure/dtos/log-filter.dto';
export declare class GetLogHistoryUseCase {
    private readonly logRepo;
    private readonly sponsorRepo;
    constructor(logRepo: DailyLogRepository, sponsorRepo: SponsorshipRepository);
    execute(userId: string, filter: LogFilterDto, requestedUserId?: string): Promise<import("../domain/daily-log.entity").DailyLogEntity[]>;
}
