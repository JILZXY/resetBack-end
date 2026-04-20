import { StreakRepository } from '../infrastructure/repositories/streak.repository';
import { StreakEventRepository } from '../infrastructure/repositories/streak-event.repository';
export declare class ResetStreakUseCase {
    private readonly streakRepo;
    private readonly eventRepo;
    constructor(streakRepo: StreakRepository, eventRepo: StreakEventRepository);
    execute(userId: string): Promise<void>;
}
