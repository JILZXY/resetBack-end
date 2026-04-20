import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { DailyLogRepository } from './infrastructure/repositories/daily-log.repository';
import { CreateLogUseCase } from './application/create-log.usecase';
import { GetLogHistoryUseCase } from './application/get-log-history.usecase';
import { GetStatisticsUseCase } from './application/get-statistics.usecase';
import { LatestLogUseCase } from './application/latest-log.usecase';
import { MovingAverageUseCase } from './application/moving-average.usecase';
import { AbsenceDetectionService } from './application/absence-detection.service';
import { SponsorshipModule } from '../sponsorship/sponsorship.module';
import { StreakModule } from '../streak/streak.module';

@Module({
  imports: [SponsorshipModule, StreakModule],
  controllers: [TrackingController],
  providers: [
    DailyLogRepository,
    CreateLogUseCase,
    GetLogHistoryUseCase,
    GetStatisticsUseCase,
    LatestLogUseCase,
    MovingAverageUseCase,
    AbsenceDetectionService,
  ],
  exports: [DailyLogRepository],
})
export class TrackingModule {}
