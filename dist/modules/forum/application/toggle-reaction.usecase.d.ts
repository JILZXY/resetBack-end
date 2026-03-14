import { ReactionRepository } from '../infrastructure/repositories/reaction.repository';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { NotificationRepository } from '../infrastructure/repositories/notification.repository';
import { NotificationGateway } from '../notification.gateway';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class ToggleReactionUseCase {
    private readonly reactionRepo;
    private readonly postRepo;
    private readonly commentRepo;
    private readonly notificationRepo;
    private readonly notificationGateway;
    private readonly prisma;
    constructor(reactionRepo: ReactionRepository, postRepo: PostRepository, commentRepo: CommentRepository, notificationRepo: NotificationRepository, notificationGateway: NotificationGateway, prisma: PrismaService);
    execute(userId: string, targetId: string, targetType: 'post' | 'comment'): Promise<{
        action: string;
        message: string;
    }>;
}
