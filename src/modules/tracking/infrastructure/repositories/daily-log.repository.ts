import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { DailyLogEntity } from '../../domain/daily-log.entity';
import { StreakRepository } from 'src/modules/streak/infrastructure/repositories/streak.repository';

@Injectable()
export class DailyLogRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly streakRepository: StreakRepository,
  ) { }

  async findByDate(userId: string, logDate: Date): Promise<DailyLogEntity | null> {
    const log = await this.prisma.dailyLog.findUnique({
      where: { user_id_log_date: { user_id: userId, log_date: logDate } },
    });
    return log ? this.toEntity(log) : null;
  }

  async findCravingLevelByValue(level: number) {
    return this.prisma.cravingLevel.findUnique({ where: { level } });
  }

  async findEmotionalStateByValue(level: number) {
    return this.prisma.emotionalState.findUnique({ where: { level } });
  }

  async createWithStreakUpdate(data: {
    userId: string;
    logDate: Date;
    consumed: boolean;
    cravingLevelId: string;
    emotionalStateId: string;
    cravingLevel?: number;
    emotionalState?: number;
    triggers?: string;
    notes?: string;
  }): Promise<DailyLogEntity> {
    const log = await this.prisma.dailyLog.create({
      data: {
        user_id: data.userId,
        log_date: data.logDate,
        consumed: data.consumed,
        craving_level_id: data.cravingLevelId,
        emotional_state_id: data.emotionalStateId,
        triggers: data.triggers ?? "",
        notes: data.notes ?? "",
      },
      include: { craving_level: true, emotional_state: true },
    });

    return this.toEntity(log);
  }

  async create(data: {
    userId: string;
    logDate: Date;
    consumed: boolean;
    cravingLevelId: string;
    emotionalStateId: string;
    triggers?: string;
    notes?: string;
  }): Promise<DailyLogEntity> {
    const log = await this.prisma.dailyLog.create({
      data: {
        user_id: data.userId,
        log_date: data.logDate,
        consumed: data.consumed,
        craving_level_id: data.cravingLevelId,
        emotional_state_id: data.emotionalStateId,
        triggers: data.triggers ?? "",
        notes: data.notes ?? "",
      },
      include: { craving_level: true, emotional_state: true },
    });
    return this.toEntity(log);
  }

  async findHistory(
    userId: string,
    from?: Date,
    to?: Date,
  ): Promise<DailyLogEntity[]> {
    const logs = await this.prisma.dailyLog.findMany({
      where: {
        user_id: userId,
        ...(from || to
          ? {
            log_date: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
          : {}),
      },
      orderBy: { log_date: 'desc' },
      include: { craving_level: true, emotional_state: true },
    });
    return logs.map((l) => this.toEntity(l));
  }

  async getStatistics(userId: string) {
    const result: any[] = await this.prisma.$queryRaw(
      Prisma.sql`SELECT * FROM core.fn_get_user_stats(${userId}::uuid)`,
    );

    if (result.length === 0) {
      return {
        day_counter: 0,
        avg_craving: null,
        avg_emotion: null,
        streak_status: 'none',
        total_relapses: 0,
      };
    }

    return result[0];
  }

  private toEntity(raw: any): DailyLogEntity {
    const entity = new DailyLogEntity();
    entity.id = raw.id;
    entity.userId = raw.user_id;
    entity.logDate = raw.log_date;
    entity.consumed = raw.consumed;
    entity.cravingLevelId = raw.craving_level_id;
    entity.emotionalStateId = raw.emotional_state_id;
    entity.triggers = raw.triggers;
    entity.notes = raw.notes;
    entity.createdAt = raw.created_at;
    return entity;
  }
}