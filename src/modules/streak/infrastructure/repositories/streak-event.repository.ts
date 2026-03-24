import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { StreakEventEntity } from '../../domain/streak-event.entity';

@Injectable()
export class StreakEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    streakId: string;
    eventType: string;
    eventDate: Date;
    daysAchieved?: number;
    avgCravingPeriod?: number;
    avgEmotionPeriod?: number;
    emergencyAlertId?: string;
  }): Promise<StreakEventEntity> {
    const event = await this.prisma.streakEvent.create({
      data: {
        streak_id: data.streakId,
        event_type: data.eventType,
        event_date: data.eventDate,
        days_achieved: data.daysAchieved ?? undefined,
        avg_craving_period: data.avgCravingPeriod ?? undefined,
        avg_emotion_period: data.avgEmotionPeriod ?? undefined,
        emergency_alert_id: data.emergencyAlertId ?? undefined,
      },
    });
    return this.toEntity(event);
  }

  async findByStreakId(streakId: string): Promise<StreakEventEntity[]> {
    const events = await this.prisma.streakEvent.findMany({
      where: { streak_id: streakId },
      orderBy: { event_date: 'desc' },
    });
    return events.map((e) => this.toEntity(e));
  }

  async getTotalDaysAchieved(streakId: string): Promise<number> {
    const events = await this.prisma.streakEvent.findMany({
      where: { streak_id: streakId, event_type: 'checkpoint' },
    });
    return events.reduce((sum, e) => sum + (e.days_achieved ?? 0), 0);
  }

  private toEntity(raw: any): StreakEventEntity {
    const entity = new StreakEventEntity();
    entity.id = raw.id;
    entity.streakId = raw.streak_id;
    entity.emergencyAlertId = raw.emergency_alert_id;
    entity.eventType = raw.event_type;
    entity.eventDate = raw.event_date;
    entity.daysAchieved = raw.days_achieved;
    entity.avgCravingPeriod = raw.avg_craving_period
      ? Number(raw.avg_craving_period)
      : null;
    entity.avgEmotionPeriod = raw.avg_emotion_period
      ? Number(raw.avg_emotion_period)
      : null;
    entity.createdAt = raw.created_at;
    return entity;
  }
}
