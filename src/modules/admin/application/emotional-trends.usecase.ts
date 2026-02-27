import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';

@Injectable()
export class EmotionalTrendsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(filter: MetricsFilterDto) {
    const where: any = {};
    if (filter.from || filter.to) {
      where.log_date = {};
      if (filter.from) where.log_date.gte = new Date(filter.from);
      if (filter.to) where.log_date.lte = new Date(filter.to);
    }

    // Obtener todos los logs con sus niveles de craving y emoción
    const logs = await this.prisma.dailyLog.findMany({
      where,
      include: { craving_level: true, emotional_state: true },
      orderBy: { log_date: 'asc' },
    });

    // Promedios globales
    const logsWithCraving = logs.filter((l) => l.craving_level !== null);
    const logsWithEmotion = logs.filter((l) => l.emotional_state !== null);

    const avgCraving = logsWithCraving.length > 0
      ? Number((logsWithCraving.reduce((sum, l) => sum + l.craving_level!.level, 0) / logsWithCraving.length).toFixed(2))
      : null;

    const avgEmotion = logsWithEmotion.length > 0
      ? Number((logsWithEmotion.reduce((sum, l) => sum + l.emotional_state!.level, 0) / logsWithEmotion.length).toFixed(2))
      : null;

    // Agrupar por fecha para serie temporal
    const dailyMap = new Map<string, { cravings: number[]; emotions: number[]; count: number }>();
    for (const log of logs) {
      const dateStr = log.log_date.toISOString().split('T')[0];
      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, { cravings: [], emotions: [], count: 0 });
      }
      const day = dailyMap.get(dateStr)!;
      day.count++;
      if (log.craving_level) day.cravings.push(log.craving_level.level);
      if (log.emotional_state) day.emotions.push(log.emotional_state.level);
    }

    const daily = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      avgCraving: data.cravings.length > 0
        ? Number((data.cravings.reduce((a, b) => a + b, 0) / data.cravings.length).toFixed(2))
        : null,
      avgEmotion: data.emotions.length > 0
        ? Number((data.emotions.reduce((a, b) => a + b, 0) / data.emotions.length).toFixed(2))
        : null,
      logCount: data.count,
    }));

    // Distribución de niveles de craving
    const cravingDist = new Map<number, number>();
    for (const log of logsWithCraving) {
      const level = log.craving_level!.level;
      cravingDist.set(level, (cravingDist.get(level) || 0) + 1);
    }

    // Distribución de niveles de emoción
    const emotionDist = new Map<number, number>();
    for (const log of logsWithEmotion) {
      const level = log.emotional_state!.level;
      emotionDist.set(level, (emotionDist.get(level) || 0) + 1);
    }

    return {
      global: {
        avgCraving,
        avgEmotion,
        totalLogs: logs.length,
      },
      daily,
      cravingDistribution: Array.from(cravingDist.entries())
        .sort(([a], [b]) => a - b)
        .map(([level, count]) => ({ level, count })),
      emotionDistribution: Array.from(emotionDist.entries())
        .sort(([a], [b]) => a - b)
        .map(([level, count]) => ({ level, count })),
    };
  }
}
