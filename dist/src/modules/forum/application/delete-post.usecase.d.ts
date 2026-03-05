import { PostRepository } from '../infrastructure/repositories/post.repository';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
export declare class DeletePostUseCase {
    private readonly postRepo;
    private readonly commentRepo;
    constructor(postRepo: PostRepository, commentRepo: CommentRepository);
    execute(userId: string, postId: string): Promise<{
        message: string;
    }>;
}
