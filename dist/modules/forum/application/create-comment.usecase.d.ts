import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { NotificationRepository } from '../infrastructure/repositories/notification.repository';
import { CreateCommentDto } from '../infrastructure/dtos/create-comment.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { NotificationGateway } from '../notification.gateway';
export declare class CreateCommentUseCase {
    private readonly commentRepo;
    private readonly postRepo;
    private readonly prisma;
    private readonly notificationRepo;
    private readonly notificationGateway;
    constructor(commentRepo: CommentRepository, postRepo: PostRepository, prisma: PrismaService, notificationRepo: NotificationRepository, notificationGateway: NotificationGateway);
    execute(userId: string, postId: string, dto: CreateCommentDto): Promise<import("../domain/comment.entity").CommentEntity>;
    private emitNotification;
}
