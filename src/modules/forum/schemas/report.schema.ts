import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

export enum ReportReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  HATE_SPEECH = 'HATE_SPEECH',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  DISMISSED = 'DISMISSED',
  ACTION_TAKEN = 'ACTION_TAKEN',
}

@Schema({
  collection: 'reports',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class Report {
  @Prop({ required: true })
  reporterId: string;

  @Prop({ required: true })
  targetId: string;

  @Prop({ required: true, enum: ['post', 'comment'] })
  targetType: string;

  @Prop({ required: true, enum: Object.values(ReportReason) })
  reason: ReportReason;

  @Prop()
  details: string;

  @Prop({ default: ReportStatus.PENDING, enum: Object.values(ReportStatus) })
  status: ReportStatus;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
