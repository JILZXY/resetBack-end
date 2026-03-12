import { Model } from 'mongoose';
import { CommentDocument } from '../../schemas/comment.schema';
import { CommentEntity } from '../../domain/comment.entity';
export declare class CommentRepository {
    private readonly commentModel;
    constructor(commentModel: Model<CommentDocument>);
    create(data: {
        postId: string;
        authorId: string;
        content: string;
        isAnonymous: boolean;
        parentId?: string;
    }): Promise<CommentEntity>;
    findByPostId(postId: string): Promise<CommentEntity[]>;
    findById(id: string): Promise<CommentEntity | null>;
    softDelete(id: string): Promise<void>;
    softDeleteByPostId(postId: string): Promise<void>;
    update(id: string, data: Partial<{
        content: string;
        isEdited: boolean;
    }>): Promise<CommentEntity | null>;
    incrementReaction(id: string): Promise<CommentEntity | null>;
    decrementReaction(id: string): Promise<CommentEntity | null>;
    private toEntity;
}
