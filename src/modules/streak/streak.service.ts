import { Injectable } from '@nestjs/common';
import { UpdateStreakUseCase } from './application/update-streak.usecase';
import { CreateStreakUseCase } from './application/create-streak.usecase';

@Injectable()
export class StreakService {
  constructor(
    private readonly updateStreak: UpdateStreakUseCase,
    private readonly createStreak: CreateStreakUseCase,
  ) {}

  async handleDailyLog(userId: string, consumed: boolean, logDate: Date): Promise<void> {
    await this.updateStreak.execute(userId, consumed, logDate);
  }

  async initializeStreak(userId: string): Promise<void> {
    await this.createStreak.execute(userId);
  }
}