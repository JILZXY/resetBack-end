import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StreakRepository } from './infrastructure/repositories/streak.repository';
import { StreakEventRepository } from './infrastructure/repositories/streak-event.repository';
import { ResetStreakUseCase } from './application/reset-streak.usecase';

@Controller('streak')
@UseGuards(JwtAuthGuard)
export class StreakController {
  constructor(
    private readonly streakRepo: StreakRepository,
    private readonly eventRepo: StreakEventRepository,
    private readonly resetStreak: ResetStreakUseCase,
  ) {}

  @Get()
  async getStreak(@Request() req: any) {
    const streak = await this.streakRepo.findByUserId(req.user.userId);
    if (!streak) return null;

    const totalDays = await this.eventRepo.getTotalDaysAchieved(streak.id);

    return {
      currentStreak: streak.dayCounter,
      status: streak.status,
      startedAt: streak.startedAt,
      lastLogDate: streak.lastLogDate,
      totalDaysAchievedHistorical: totalDays,
    };
  }

  @Get('events')
  async getEvents(@Request() req: any) {
    const streak = await this.streakRepo.findByUserId(req.user.userId);
    if (!streak) return [];
    return this.eventRepo.findByStreakId(streak.id);
  }

  @Post('reset')
  async reset(@Request() req: any) {
    await this.resetStreak.execute(req.user.userId);
    return { message: 'Racha reiniciada correctamente' };
  }
}