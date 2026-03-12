import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  REACTION = 'REACTION',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  REPORT_UPDATE = 'REPORT_UPDATE',
  SPONSORSHIP_REQUEST = 'SPONSORSHIP_REQUEST',
  SPONSORSHIP_ACCEPTED = 'SPONSORSHIP_ACCEPTED',
  SPONSORSHIP_REJECTED = 'SPONSORSHIP_REJECTED',
}

@Schema({
  collection: 'notifications',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class Notification {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  actorId: string;

  @Prop({ required: true, enum: Object.values(NotificationType) })
  type: NotificationType;

  @Prop({ required: true })
  targetId: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
