import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class StreaksSummaryUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const [totalStreaks, activeStreaks, brokenStreaks] = await Promise.all([
      this.prisma.streak.count(),
      this.prisma.streak.count({ where: { status: 'active' } }),
      this.prisma.streak.count({ where: { status: 'broken' } }),
    ]);

    const streakAgg = await this.prisma.streak.aggregate({
      _avg: { day_counter: true },
      _max: { day_counter: true },
    });

    const activeAgg = await this.prisma.streak.aggregate({
      where: { status: 'active' },
      _avg: { day_counter: true },
      _max: { day_counter: true },
    });

    const allStreaks = await this.prisma.streak.findMany({
      select: { day_counter: true, status: true },
    });

    const distribution = {
      '0-7': 0,
      '8-14': 0,
      '15-30': 0,
      '31-60': 0,
      '61-90': 0,
      '90+': 0,
    };

    for (const s of allStreaks) {
      const days = s.day_counter;
      if (days <= 7) distribution['0-7']++;
      else if (days <= 14) distribution['8-14']++;
      else if (days <= 30) distribution['15-30']++;
      else if (days <= 60) distribution['31-60']++;
      else if (days <= 90) distribution['61-90']++;
      else distribution['90+']++;
    }

    const relapseRate =
      totalStreaks > 0
        ? Number(((brokenStreaks / totalStreaks) * 100).toFixed(2))
        : 0;

    return {
      summary: {
        totalStreaks,
        activeStreaks,
        brokenStreaks,
        relapseRate,
      },
      averages: {
        avgDaysAll: streakAgg._avg.day_counter
          ? Number(streakAgg._avg.day_counter.toFixed(2))
          : 0,
        maxDaysAll: streakAgg._max.day_counter ?? 0,
        avgDaysActive: activeAgg._avg.day_counter
          ? Number(activeAgg._avg.day_counter.toFixed(2))
          : 0,
        maxDaysActive: activeAgg._max.day_counter ?? 0,
      },
      distribution,
    };
  }
}
