import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema({
  collection: 'reactions',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class Reaction {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  targetId: string;

  @Prop({ required: true, enum: ['post', 'comment'] })
  targetType: string;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);

// Índice único compuesto: un usuario solo puede reaccionar una vez por target
ReactionSchema.index(
  { targetId: 1, targetType: 1, userId: 1 },
  { unique: true },
);
