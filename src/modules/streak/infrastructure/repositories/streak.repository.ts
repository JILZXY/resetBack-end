import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { StreakEntity } from '../../domain/streak.entity';

@Injectable()
export class StreakRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findByUserId(userId: string): Promise<StreakEntity | null> {
    const streak = await this.prisma.streak.findUnique({
      where: { user_id: userId },
    });
    return streak ? this.toEntity(streak) : null;
  }

  async create(data: {
    userId: string;
    userAddictionId: string;
    startedAt: Date;
  }): Promise<StreakEntity> {
    const streak = await this.prisma.streak.create({
      data: {
        user_id: data.userId,
        user_addiction_id: data.userAddictionId,
        started_at: data.startedAt,
        day_counter: 0,
        status: 'active',
      },
    });
    return this.toEntity(streak);
  }

  async incrementDay(
    streakId: string,
    lastLogDate: Date,
    tx?: Prisma.TransactionClient,
  ): Promise<StreakEntity> {
    const client = tx || this.prisma;

    const streak = await client.streak.update({
      where: { id: streakId },
      data: {
        day_counter: { increment: 1 },
        last_log_date: lastLogDate,
        status: 'active',
      },
    });

    await client.streakEvent.create({
      data: {
        streak_id: streakId,
        event_type: 'progress',
        event_date: new Date(),
        days_achieved: streak.day_counter,
      },
    });

    return this.toEntity(streak);
  }

  async reset(
    streakId: string,
    newStartedAt: Date,
    currentDayCounter: number,
    tx?: Prisma.TransactionClient,
  ): Promise<StreakEntity> {
    const client = tx || this.prisma;

    const streak = await client.streak.update({
      where: { id: streakId },
      data: {
        day_counter: 0,
        started_at: newStartedAt,
        last_log_date: newStartedAt,
        status: 'broken',
      },
    });

    await client.streakEvent.create({
      data: {
        streak_id: streakId,
        event_type: 'relapse',
        event_date: new Date(),
        days_achieved: currentDayCounter,
      },
    });

    return this.toEntity(streak);
  }

  private toEntity(raw: any): StreakEntity {
    const entity = new StreakEntity();
    entity.id = raw.id;
    entity.userId = raw.user_id;
    entity.userAddictionId = raw.user_addiction_id;
    entity.status = raw.status;
    entity.startedAt = raw.started_at;
    entity.dayCounter = raw.day_counter;
    entity.lastLogDate = raw.last_log_date;
    entity.updatedAt = raw.updated_at;
    return entity;
  }
}