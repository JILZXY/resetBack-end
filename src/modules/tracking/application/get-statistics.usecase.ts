import { Injectable } from '@nestjs/common';
import { DailyLogRepository } from '../infrastructure/repositories/daily-log.repository';

@Injectable()
export class GetStatisticsUseCase {
  constructor(private readonly logRepo: DailyLogRepository) {}

  async execute(userId: string) {
    const stats = await this.logRepo.getStatistics(userId);
    return {
      totalLogs: stats.total_logs,
      relapseCount: stats.relapse_count,
      soberDays: stats.total_logs - stats.relapse_count,
      averageCraving: stats.avg_craving,
      averageEmotionalState: stats.avg_emotion,
    };
  }
}