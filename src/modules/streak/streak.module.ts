import { Module } from '@nestjs/common';
import { StreakController } from './streak.controller';
import { StreakRepository } from './infrastructure/repositories/streak.repository';
import { StreakEventRepository } from './infrastructure/repositories/streak-event.repository';
import { CreateStreakUseCase } from './application/create-streak.usecase';
import { ResetStreakUseCase } from './application/reset-streak.usecase';
import { BestStreaksUseCase } from './application/best-streaks.usecase';

@Module({
  controllers: [StreakController],
  providers: [
    StreakRepository,
    StreakEventRepository,
    CreateStreakUseCase,
    ResetStreakUseCase,
    BestStreaksUseCase,
  ],
  exports: [CreateStreakUseCase],
})
export class StreakModule {}
