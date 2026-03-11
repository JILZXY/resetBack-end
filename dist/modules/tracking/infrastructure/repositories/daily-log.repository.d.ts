import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { DailyLogEntity } from '../../domain/daily-log.entity';
import { StreakRepository } from 'src/modules/streak/infrastructure/repositories/streak.repository';
export declare class DailyLogRepository {
    private readonly prisma;
    private readonly streakRepository;
    constructor(prisma: PrismaService, streakRepository: StreakRepository);
    findByDate(userId: string, logDate: Date): Promise<DailyLogEntity | null>;
    findCravingLevelByValue(level: number): Promise<{
        id: string;
        level: number;
        label: string;
        description: string;
        recommendation: string;
    } | null>;
    findEmotionalStateByValue(level: number): Promise<{
        id: string;
        level: number;
        label: string;
        description: string;
        category: string;
    } | null>;
    createWithStreakUpdate(data: {
        userId: string;
        logDate: Date;
        consumed: boolean;
        cravingLevelId: string;
        emotionalStateId: string;
        cravingLevel?: number;
        emotionalState?: number;
        triggers?: string;
        notes?: string;
    }): Promise<DailyLogEntity>;
    create(data: {
        userId: string;
        logDate: Date;
        consumed: boolean;
        cravingLevelId: string;
        emotionalStateId: string;
        triggers?: string;
        notes?: string;
    }): Promise<DailyLogEntity>;
    findHistory(userId: string, from?: Date, to?: Date): Promise<DailyLogEntity[]>;
    getStatistics(userId: string): Promise<any>;
    private toEntity;
}
