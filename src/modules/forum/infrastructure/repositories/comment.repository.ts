import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '../../schemas/comment.schema';
import { CommentEntity } from '../../domain/comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async create(data: {
    postId: string;
    authorId: string;
    content: string;
    isAnonymous: boolean;
    parentId?: string;
  }): Promise<CommentEntity> {
    const comment = await this.commentModel.create({
      postId: data.postId,
      authorId: data.authorId,
      content: data.content,
      isAnonymous: data.isAnonymous,
      parentId: data.parentId ?? null,
    });
    return this.toEntity(comment);
  }

  async findByPostId(postId: string): Promise<CommentEntity[]> {
    const comments = await this.commentModel
      .find({ postId: postId, isDeleted: false })
      .sort({ createdAt: 1 })
      .exec();
    return comments.map((c) => this.toEntity(c));
  }

  async findById(id: string): Promise<CommentEntity | null> {
    const comment = await this.commentModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    return comment ? this.toEntity(comment) : null;
  }

  async softDelete(id: string): Promise<void> {
    await this.commentModel
      .findByIdAndUpdate(id, { $set: { isDeleted: true } })
      .exec();
  }

  async softDeleteByPostId(postId: string): Promise<void> {
    await this.commentModel
      .updateMany({ postId: postId }, { $set: { isDeleted: true } })
      .exec();
  }

  async update(
    id: string,
    data: Partial<{
      content: string;
      isEdited: boolean;
    }>,
  ): Promise<CommentEntity | null> {
    const comment = await this.commentModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
    return comment ? this.toEntity(comment) : null;
  }

  async incrementReaction(id: string): Promise<CommentEntity | null> {
    const comment = await this.commentModel
      .findByIdAndUpdate(id, { $inc: { reactionUps: 1 } }, { new: true })
      .exec();
    return comment ? this.toEntity(comment) : null;
  }

  async decrementReaction(id: string): Promise<CommentEntity | null> {
    const comment = await this.commentModel
      .findByIdAndUpdate(id, { $inc: { reactionUps: -1 } }, { new: true })
      .exec();
    return comment ? this.toEntity(comment) : null;
  }

  private toEntity(raw: CommentDocument): CommentEntity {
    const entity = new CommentEntity();
    entity.id = (raw._id as any).toString();
    entity.postId = raw.postId;
    entity.parentId = raw.parentId ?? null;
    entity.authorId = raw.authorId;
    entity.content = raw.content;
    entity.isAnonymous = raw.isAnonymous;
    entity.reactionUps = raw.reactionUps;
    entity.isDeleted = raw.isDeleted;
    entity.isEdited = raw.isEdited;
    entity.createdAt = (raw as any).createdAt;
    entity.updatedAt = (raw as any).updatedAt;
    return entity;
  }
}
