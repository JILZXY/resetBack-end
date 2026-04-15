import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';

@Injectable()
export class LogsFrequencyUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(filter: MetricsFilterDto) {
    const where: any = {};
    if (filter.from || filter.to) {
      where.log_date = {};
      if (filter.from) where.log_date.gte = new Date(filter.from);
      if (filter.to) where.log_date.lte = new Date(filter.to);
    }

    const logsByDate = await this.prisma.dailyLog.groupBy({
      by: ['log_date'],
      where,
      _count: { id: true },
      orderBy: { log_date: 'asc' },
    });

    const totalLogs = logsByDate.reduce((sum, d) => sum + d._count.id, 0);
    const totalDays = logsByDate.length || 1;

    const logsConsumed = await this.prisma.dailyLog.count({
      where: { ...where, consumed: true },
    });
    const logsClean = await this.prisma.dailyLog.count({
      where: { ...where, consumed: false },
    });

    const uniqueUsers = await this.prisma.dailyLog.groupBy({
      by: ['user_id'],
      where,
    });

    return {
      summary: {
        totalLogs,
        avgLogsPerDay: Number((totalLogs / totalDays).toFixed(2)),
        logsWithConsumption: logsConsumed,
        logsClean,
        uniqueUsersLogging: uniqueUsers.length,
      },
      daily: logsByDate.map((d) => ({
        date: d.log_date,
        count: d._count.id,
      })),
    };
  }
}
