import { StreakRepository } from './infrastructure/repositories/streak.repository';
import { StreakEventRepository } from './infrastructure/repositories/streak-event.repository';
import { ResetStreakUseCase } from './application/reset-streak.usecase';
import { BestStreaksUseCase } from './application/best-streaks.usecase';
export declare class StreakController {
    private readonly streakRepo;
    private readonly eventRepo;
    private readonly resetStreak;
    private readonly bestStreaks;
    constructor(streakRepo: StreakRepository, eventRepo: StreakEventRepository, resetStreak: ResetStreakUseCase, bestStreaks: BestStreaksUseCase);
    getStreak(req: any): Promise<{
        currentStreak: number;
        status: string | null;
        startedAt: Date;
        lastLogDate: Date | null;
        totalDaysAchievedHistorical: number;
    } | null>;
    getEvents(req: any): Promise<import("./domain/streak-event.entity").StreakEventEntity[]>;
    getBest(req: any): Promise<any[]>;
    reset(req: any): Promise<{
        message: string;
    }>;
}
