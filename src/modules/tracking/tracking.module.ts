import { Module, forwardRef } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { DailyLogRepository } from './infrastructure/repositories/daily-log.repository';
import { CreateLogUseCase } from './application/create-log.usecase';
import { GetLogHistoryUseCase } from './application/get-log-history.usecase';
import { GetStatisticsUseCase } from './application/get-statistics.usecase';
import { StreakModule } from '../streak/streak.module'

@Module({
  imports: [forwardRef(() => StreakModule)], 
  controllers: [TrackingController],
  providers: [
    DailyLogRepository,
    CreateLogUseCase,
    GetLogHistoryUseCase,
    GetStatisticsUseCase,
  ],
  exports: [DailyLogRepository],
})
export class TrackingModule {}