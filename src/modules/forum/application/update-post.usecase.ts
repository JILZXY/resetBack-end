import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { UpdatePostDto } from '../infrastructure/dtos/update-post.dto';

@Injectable()
export class UpdatePostUseCase {
  constructor(private readonly postRepo: PostRepository) {}

  async execute(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.postRepo.findById(postId);

    if (!post) {
      throw new HttpException(
        { code: 'POST_NOT_FOUND', message: 'Post no encontrado', details: { postId } },
        HttpStatus.NOT_FOUND,
      );
    }

    if (post.authorId !== userId) {
      throw new HttpException(
        { code: 'FORBIDDEN', message: 'No tienes permiso para editar este post', details: {} },
        HttpStatus.FORBIDDEN,
      );
    }

    return this.postRepo.update(postId, {
      title: dto.title,
      content: dto.content,
      tags: dto.tags,
      images: dto.images,
      isEdited: true,
    });
  }
}