import { Injectable } from '@nestjs/common';
import { StreakRepository } from '../infrastructure/repositories/streak.repository';
import { StreakEventRepository } from '../infrastructure/repositories/streak-event.repository';
import { DailyLogRepository } from 'src/modules/tracking/infrastructure/repositories/daily-log.repository';

@Injectable()
export class UpdateStreakUseCase {
  constructor(
    private readonly streakRepo: StreakRepository,
    private readonly eventRepo: StreakEventRepository,
    private readonly logRepo: DailyLogRepository,
  ) {}

  async execute(userId: string, consumed: boolean, logDate: Date): Promise<void> {
    const streak = await this.streakRepo.findByUserId(userId);
    if (!streak) return; // Si no hay racha activa no hacemos nada

    if (!consumed) {
      // Día sobrio: incrementar contador
      await this.streakRepo.incrementDay(streak.id, logDate);

      // Registrar checkpoint cada 7 días
      const updatedStreak = await this.streakRepo.findByUserId(userId);
      if (updatedStreak && updatedStreak.dayCounter % 7 === 0) {
        const stats = await this.logRepo.getStatistics(userId);
        await this.eventRepo.create({
          streakId: streak.id,
          eventType: 'checkpoint',
          eventDate: logDate,
          daysAchieved: updatedStreak.dayCounter,
          avgCravingPeriod: stats.avg_craving ?? undefined,
          avgEmotionPeriod: stats.avg_emotion ?? undefined,
        });
      }
    } else {
      // Hubo consumo: registrar reset y reiniciar racha
      await this.eventRepo.create({
        streakId: streak.id,
        eventType: 'reset',
        eventDate: logDate,
        daysAchieved: streak.dayCounter,
      });

      await this.streakRepo.reset(streak.id, logDate);
    }
  }
}