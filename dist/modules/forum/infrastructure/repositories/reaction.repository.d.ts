import { Model } from 'mongoose';
import { ReactionDocument } from '../../schemas/reaction.schema';
import { ReactionEntity } from '../../domain/reaction.entity';
export declare class ReactionRepository {
    private readonly reactionModel;
    constructor(reactionModel: Model<ReactionDocument>);
    findOne(userId: string, targetId: string, targetType: string): Promise<ReactionEntity | null>;
    create(data: {
        userId: string;
        targetId: string;
        targetType: string;
    }): Promise<ReactionEntity>;
    delete(userId: string, targetId: string, targetType: string): Promise<void>;
    private toEntity;
}
