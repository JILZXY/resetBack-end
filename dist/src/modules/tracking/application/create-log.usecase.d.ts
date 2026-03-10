import { DailyLogRepository } from '../infrastructure/repositories/daily-log.repository';
import { CreateLogDto } from '../infrastructure/dtos/create-log.dto';
export declare class CreateLogUseCase {
    private readonly logRepo;
    constructor(logRepo: DailyLogRepository);
    execute(userId: string, dto: CreateLogDto): Promise<import("../domain/daily-log.entity").DailyLogEntity>;
}
