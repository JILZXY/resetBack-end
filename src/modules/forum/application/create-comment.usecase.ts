import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { CreateCommentDto } from '../infrastructure/dtos/create-comment.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly postRepo: PostRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, postId: string, dto: CreateCommentDto) {
    const post = await this.postRepo.findById(postId);

    if (!post) {
      throw new HttpException(
        { code: 'POST_NOT_FOUND', message: 'Post no encontrado', details: { postId } },
        HttpStatus.NOT_FOUND,
      );
    }

    if (dto.parent_id) {
      const parent = await this.commentRepo.findById(dto.parent_id);
      if (!parent || parent.postId !== postId) {
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

    return comment;
  }
}