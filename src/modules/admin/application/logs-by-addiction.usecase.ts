import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';

@Injectable()
export class LogsByAddictionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(filter: MetricsFilterDto) {
    const logWhere: any = {};
    if (filter.from || filter.to) {
      logWhere.log_date = {};
      if (filter.from) logWhere.log_date.gte = new Date(filter.from);
      if (filter.to) logWhere.log_date.lte = new Date(filter.to);
    }

    // Obtener todas las adicciones activas con sus usuarios
    const addictions = await this.prisma.userAddiction.findMany({
      where: { is_active: true },
      select: {
        user_id: true,
        custom_name: true,
        classification: true,
      },
    });

    // Agrupar usuarios por clasificación de adicción
    const classificationMap = new Map<string, Set<string>>();
    const addictionNameMap = new Map<string, Set<string>>();

    for (const a of addictions) {
      const classification = a.classification ?? 'unknown';
      if (!classificationMap.has(classification)) {
        classificationMap.set(classification, new Set());
      }
      classificationMap.get(classification)!.add(a.user_id);

      const name = a.custom_name ?? 'unknown';
      if (!addictionNameMap.has(name)) {
        addictionNameMap.set(name, new Set());
      }
      addictionNameMap.get(name)!.add(a.user_id);
    }

    // Calcular métricas por clasificación (chemical vs behavioral)
    const byClassification: any[] = [];
    for (const [classification, userIds] of classificationMap) {
      const ids = Array.from(userIds);
      const where = { ...logWhere, user_id: { in: ids } };

      const [totalLogs, consumedLogs, uniqueLoggers] = await Promise.all([
        this.prisma.dailyLog.count({ where }),
        this.prisma.dailyLog.count({ where: { ...where, consumed: true } }),
        this.prisma.dailyLog.groupBy({ by: ['user_id'], where }),
      ]);

      byClassification.push({
        classification,
        totalUsers: ids.length,
        totalLogs,
        avgLogsPerUser:
          ids.length > 0 ? Number((totalLogs / ids.length).toFixed(2)) : 0,
        consumedLogs,
        relapseRate:
          totalLogs > 0
            ? Number(((consumedLogs / totalLogs) * 100).toFixed(2))
            : 0,
        activeLoggers: uniqueLoggers.length,
      });
    }

    // Calcular métricas por nombre de adicción
    const byAddictionName: any[] = [];
    for (const [name, userIds] of addictionNameMap) {
      const ids = Array.from(userIds);
      const totalLogs = await this.prisma.dailyLog.count({
        where: { ...logWhere, user_id: { in: ids } },
      });

      byAddictionName.push({
        addictionName: name,
        totalUsers: ids.length,
        totalLogs,
        avgLogsPerUser:
          ids.length > 0 ? Number((totalLogs / ids.length).toFixed(2)) : 0,
      });
    }

    // Ordenar por totalLogs descendente
    byAddictionName.sort((a, b) => b.totalLogs - a.totalLogs);

    return {
      byClassification,
      byAddictionName,
    };
  }
}
