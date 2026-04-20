import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { NotificationRepository } from '../infrastructure/repositories/notification.repository';
import { CreateCommentDto } from '../infrastructure/dtos/create-comment.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { NotificationGateway } from '../notification.gateway';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly postRepo: PostRepository,
    private readonly prisma: PrismaService,
    private readonly notificationRepo: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async execute(userId: string, postId: string, dto: CreateCommentDto) {
    const post = await this.postRepo.findById(postId);

    if (!post) {
      throw new HttpException(
        {
          code: 'POST_NOT_FOUND',
          message: 'Post no encontrado',
          details: { postId },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    let parentComment: any = null;
    if (dto.parent_id) {
      parentComment = await this.commentRepo.findById(dto.parent_id);
      if (!parentComment || parentComment.postId !== postId) {
        throw new HttpException(
          {
            code: 'PARENT_COMMENT_NOT_FOUND',
            message: 'El comentario padre no existe o no pertenece a este post',
            details: { parent_id: dto.parent_id },
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const comment = await this.commentRepo.create({
      postId,
      authorId: userId,
      content: dto.content,
      isAnonymous: dto.is_anonymous,
      parentId: dto.parent_id,
    });

    await this.postRepo.incrementCommentCount(postId);

    if (!comment.isAnonymous) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      comment.authorName = user?.name;
    }

    this.emitNotification(userId, postId, post.authorId, parentComment).catch(
      () => {},
    );

    return comment;
  }

  private async emitNotification(
    actorId: string,
    postId: string,
    postAuthorId: string,
    parentComment: any,
  ) {
    const actor = await this.prisma.user.findUnique({ where: { id: actorId } });

    if (parentComment) {
      if (parentComment.authorId && parentComment.authorId !== actorId) {
        const notification = await this.notificationRepo.create({
          userId: parentComment.authorId,
          actorId,
          actorName: actor?.name,
          actorAvatarUrl: (actor as any)?.avatar_url,
          type: 'REPLY',
          targetId: postId,
        });
        this.notificationGateway.sendToUser(
          parentComment.authorId,
          notification,
        );
      }
    } else {
      if (postAuthorId && postAuthorId !== actorId) {
        const notification = await this.notificationRepo.create({
          userId: postAuthorId,
          actorId,
          actorName: actor?.name,
          actorAvatarUrl: (actor as any)?.avatar_url,
          type: 'COMMENT',
          targetId: postId,
        });
        this.notificationGateway.sendToUser(postAuthorId, notification);
      }
    }
  }
}
