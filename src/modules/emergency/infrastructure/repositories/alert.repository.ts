import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { EmergencyAlertEntity } from '../../domain/emergency-alert.entity';

@Injectable()
export class AlertRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    userAddictionId: string;
    resultedInRelapse?: boolean;
    resolutionNotes?: string;
  }): Promise<EmergencyAlertEntity> {
    const alert = await this.prisma.emergencyAlert.create({
      data: {
        user_id: data.userId,
        user_addiction_id: data.userAddictionId,
        resulted_in_relapse: data.resultedInRelapse ?? false,
        resolution_notes: data.resolutionNotes ?? '',
      },
    });
    return this.toEntity(alert);
  }

  async findAllByUserId(userId: string): Promise<EmergencyAlertEntity[]> {
    const alerts = await this.prisma.emergencyAlert.findMany({
      where: { user_id: userId },
      orderBy: { activated_at: 'desc' },
    });
    return alerts.map((a) => this.toEntity(a));
  }

  private toEntity(raw: any): EmergencyAlertEntity {
    const entity = new EmergencyAlertEntity();
    entity.id = raw.id;
    entity.userId = raw.user_id;
    entity.userAddictionId = raw.user_addiction_id;
    entity.activatedAt = raw.activated_at;
    entity.resultedInRelapse = raw.resulted_in_relapse;
    entity.resolutionNotes = raw.resolution_notes;
    entity.createdAt = raw.created_at;
    return entity;
  }
}
