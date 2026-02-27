import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../../schemas/notification.schema';
import { NotificationEntity } from '../../domain/notification.entity';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: {
    userId: string;
    actorId: string;
    type: string;
    targetId: string;
  }): Promise<NotificationEntity> {
    const notification = await this.notificationModel.create(data);
    return this.toEntity(notification);
  }

  async findByUserId(userId: string): Promise<NotificationEntity[]> {
    const notifications = await this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
    return notifications.map((n) => this.toEntity(n));
  }

  async markAsRead(id: string): Promise<void> {
    await this.notificationModel.findByIdAndUpdate(id, { $set: { isRead: true } }).exec();
  }

  private toEntity(raw: NotificationDocument): NotificationEntity {
    const entity = new NotificationEntity();
    entity.id = (raw._id as any).toString();
    entity.userId = raw.userId;
    entity.actorId = raw.actorId;
    entity.type = raw.type;
    entity.targetId = raw.targetId;
    entity.isRead = raw.isRead;
    entity.createdAt = (raw as any).createdAt;
    return entity;
  }
}
