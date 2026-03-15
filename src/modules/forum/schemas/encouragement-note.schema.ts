import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EncouragementNoteDocument = HydratedDocument<EncouragementNote>;

@Schema({
  collection: 'encouragement_notes',
  timestamps: { createdAt: 'createdAt', updatedAt: false },
})
export class EncouragementNote {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  content: string;
}

export const EncouragementNoteSchema =
  SchemaFactory.createForClass(EncouragementNote);

EncouragementNoteSchema.index({ receiverId: 1, createdAt: -1 });
EncouragementNoteSchema.index({ senderId: 1 });
