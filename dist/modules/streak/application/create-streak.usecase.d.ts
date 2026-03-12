import { StreakRepository } from '../infrastructure/repositories/streak.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class CreateStreakUseCase {
    private readonly streakRepo;
    private readonly prisma;
    constructor(streakRepo: StreakRepository, prisma: PrismaService);
    execute(userId: string): Promise<void>;
}
