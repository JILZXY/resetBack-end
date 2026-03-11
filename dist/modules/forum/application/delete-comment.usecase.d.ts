import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { PostRepository } from '../infrastructure/repositories/post.repository';
export declare class DeleteCommentUseCase {
    private readonly commentRepo;
    private readonly postRepo;
    constructor(commentRepo: CommentRepository, postRepo: PostRepository);
    execute(userId: string, commentId: string): Promise<{
        message: string;
    }>;
}
