import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ collection: 'comments', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Comment {
  @Prop({ required: true })
  postId: string;

  @Prop({ default: null })
  parentId: string | null;

  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: false })
  isAnonymous: boolean;

  @Prop({ default: 0 })
  reactionUps: number;

  @Prop({ default: 0 })
  reportCount: number;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isEdited: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);