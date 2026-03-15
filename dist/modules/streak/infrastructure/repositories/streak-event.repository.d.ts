import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { StreakEventEntity } from '../../domain/streak-event.entity';
export declare class StreakEventRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        streakId: string;
        eventType: string;
        eventDate: Date;
        daysAchieved?: number;
        avgCravingPeriod?: number;
        avgEmotionPeriod?: number;
        emergencyAlertId?: string;
    }): Promise<StreakEventEntity>;
    findByStreakId(streakId: string): Promise<StreakEventEntity[]>;
    getTotalDaysAchieved(streakId: string): Promise<number>;
    private toEntity;
}
