import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { StreakEntity } from '../../domain/streak.entity';
export declare class StreakRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<StreakEntity | null>;
    create(data: {
        userId: string;
        userAddictionId: string;
        startedAt: Date;
    }): Promise<StreakEntity>;
    incrementDay(streakId: string, lastLogDate: Date): Promise<StreakEntity>;
    reset(streakId: string, newStartedAt: Date): Promise<StreakEntity>;
    private toEntity;
}
