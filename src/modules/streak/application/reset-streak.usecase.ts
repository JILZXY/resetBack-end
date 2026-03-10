import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { StreakRepository } from '../infrastructure/repositories/streak.repository';
import { StreakEventRepository } from '../infrastructure/repositories/streak-event.repository';

@Injectable()
export class ResetStreakUseCase {
  constructor(
    private readonly streakRepo: StreakRepository,
    private readonly eventRepo: StreakEventRepository,
  ) { }

  async execute(userId: string): Promise<void> {
    const streak = await this.streakRepo.findByUserId(userId);

    if (!streak) {
      throw new HttpException(
        {
          code: 'STREAK_NOT_FOUND',
          message: 'No se encontró una racha activa para este usuario',
          details: { user_id: userId },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.streakRepo.reset(streak.id, new Date(), streak.dayCounter);
  }
}