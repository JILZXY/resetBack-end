import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction, ReactionDocument } from '../../schemas/reaction.schema';
import { ReactionEntity } from '../../domain/reaction.entity';

@Injectable()
export class ReactionRepository {
  constructor(
    @InjectModel(Reaction.name) private readonly reactionModel: Model<ReactionDocument>,
  ) {}

  async findOne(userId: string, targetId: string, targetType: string): Promise<ReactionEntity | null> {
    const reaction = await this.reactionModel
      .findOne({ userId, targetId, targetType })
      .exec();
    return reaction ? this.toEntity(reaction) : null;
  }

  async create(data: {
    userId: string;
    targetId: string;
    targetType: string;
  }): Promise<ReactionEntity> {
    const reaction = await this.reactionModel.create(data);
    return this.toEntity(reaction);
  }

  async delete(userId: string, targetId: string, targetType: string): Promise<void> {
    await this.reactionModel.deleteOne({ userId, targetId, targetType }).exec();
  }

  private toEntity(raw: ReactionDocument): ReactionEntity {
    const entity = new ReactionEntity();
    entity.id = (raw._id as any).toString();
    entity.userId = raw.userId;
    entity.targetId = raw.targetId;
    entity.targetType = raw.targetType;
    entity.createdAt = (raw as any).createdAt;
    return entity;
  }
}
