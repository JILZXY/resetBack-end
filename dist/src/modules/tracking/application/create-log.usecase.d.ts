import { DailyLogRepository } from '../infrastructure/repositories/daily-log.repository';
import { CreateLogDto } from '../infrastructure/dtos/create-log.dto';
import { CreateStreakUseCase } from '../../streak/application/create-streak.usecase';
export declare class CreateLogUseCase {
    private readonly logRepo;
    private readonly createStreak;
    constructor(logRepo: DailyLogRepository, createStreak: CreateStreakUseCase);
    execute(userId: string, dto: CreateLogDto): Promise<import("../domain/daily-log.entity").DailyLogEntity>;
}
