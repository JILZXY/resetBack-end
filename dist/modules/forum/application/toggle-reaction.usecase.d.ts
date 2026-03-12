import { ReactionRepository } from '../infrastructure/repositories/reaction.repository';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { NotificationRepository } from '../infrastructure/repositories/notification.repository';
import { NotificationGateway } from '../notification.gateway';
export declare class ToggleReactionUseCase {
    private readonly reactionRepo;
    private readonly postRepo;
    private readonly commentRepo;
    private readonly notificationRepo;
    private readonly notificationGateway;
    constructor(reactionRepo: ReactionRepository, postRepo: PostRepository, commentRepo: CommentRepository, notificationRepo: NotificationRepository, notificationGateway: NotificationGateway);
    execute(userId: string, targetId: string, targetType: 'post' | 'comment'): Promise<{
        action: string;
        message: string;
    }>;
}
