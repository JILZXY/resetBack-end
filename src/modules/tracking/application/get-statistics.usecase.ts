import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DailyLogRepository } from '../infrastructure/repositories/daily-log.repository';
import { SponsorshipRepository } from '../../sponsorship/infrastructure/repositories/sponsorship.repository';

@Injectable()
export class GetStatisticsUseCase {
  constructor(
    private readonly logRepo: DailyLogRepository,
    private readonly sponsorRepo: SponsorshipRepository,
  ) {}

  async execute(userId: string, requestedUserId?: string) {
    const targetUserId = requestedUserId || userId;

    if (userId !== targetUserId) {
      const isActiveSponsor = await this.sponsorRepo.checkActiveSponsorship(userId, targetUserId);
      if (!isActiveSponsor) {
        throw new HttpException('No tienes permisos para ver las estadísticas de este usuario', HttpStatus.FORBIDDEN);
      }
    }

    const stats = await this.logRepo.getStatistics(targetUserId);
    return {
      dayCounter: stats.day_counter,
      averageCraving: stats.avg_craving,
      averageEmotionalState: stats.avg_emotion,
      streakStatus: stats.streak_status,
      totalRelapses: stats.total_relapses,
    };
  }
}