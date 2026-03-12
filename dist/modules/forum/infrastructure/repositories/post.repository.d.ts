import { Model } from 'mongoose';
import { PostDocument } from '../../schemas/post.schema';
import { PostEntity } from '../../domain/post.entity';
export declare class PostRepository {
    private readonly postModel;
    constructor(postModel: Model<PostDocument>);
    create(data: {
        authorId: string;
        title: string;
        content: string;
        isAnonymous: boolean;
        tags?: string[];
        images?: string[];
    }): Promise<PostEntity>;
    findAll(page: number, limit: number, tag?: string): Promise<PostEntity[]>;
    findById(id: string): Promise<PostEntity | null>;
    findByAuthorId(authorId: string): Promise<PostEntity[]>;
    update(id: string, data: Partial<{
        title: string;
        content: string;
        tags: string[];
        images: string[];
        isDeleted: boolean;
        isEdited: boolean;
    }>): Promise<PostEntity | null>;
    softDelete(id: string): Promise<void>;
    incrementReaction(id: string): Promise<PostEntity | null>;
    decrementReaction(id: string): Promise<PostEntity | null>;
    incrementCommentCount(id: string): Promise<void>;
    decrementCommentCount(id: string): Promise<void>;
    private toEntity;
}
