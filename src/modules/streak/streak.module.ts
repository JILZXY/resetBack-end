import { Module, forwardRef } from '@nestjs/common';
import { StreakController } from './streak.controller';
import { StreakService } from './streak.service';
import { StreakRepository } from './infrastructure/repositories/streak.repository';
import { StreakEventRepository } from './infrastructure/repositories/streak-event.repository';
import { CreateStreakUseCase } from './application/create-streak.usecase';
import { UpdateStreakUseCase } from './application/update-streak.usecase';
import { ResetStreakUseCase } from './application/reset-streak.usecase';
import { TrackingModule } from '../tracking/tracking.module';

@Module({
  imports: [forwardRef(() => TrackingModule)],
  controllers: [StreakController],
  providers: [
    StreakService,
    StreakRepository,
    StreakEventRepository,
    CreateStreakUseCase,
    UpdateStreakUseCase,
    ResetStreakUseCase,
  ],
  exports: [StreakService],
})
export class StreakModule {}
