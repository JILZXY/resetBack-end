import { Injectable } from '@nestjs/common';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class GetPostsUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(page: number, limit: number, tag?: string) {
    const posts = await this.postRepo.findAll(page, limit, tag);

    const authorIds = [
      ...new Set(posts.filter((p) => !p.isAnonymous).map((p) => p.authorId)),
    ];

    const users = authorIds.length
      ? await this.prisma.user.findMany({
          where: { id: { in: authorIds } },
          select: { id: true, name: true },
        })
      : [];

    const userMap = new Map(users.map((u) => [u.id, u.name]));

    return posts.map((p) => ({
      ...p,
      authorName: p.isAnonymous ? null : (userMap.get(p.authorId) ?? null),
    }));
  }
}
