import { Injectable } from '@nestjs/common';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { CreatePostDto } from '../infrastructure/dtos/create-post.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, dto: CreatePostDto) {
    const post = await this.postRepo.create({
      authorId: userId,
      title: dto.title,
      content: dto.content,
      isAnonymous: dto.is_anonymous,
      tags: dto.tags,
      images: dto.images,
    });

    if (!post.isAnonymous) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      post.authorName = user?.name;
    }

    return post;
  }
}
