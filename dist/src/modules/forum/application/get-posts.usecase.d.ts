import { PostRepository } from '../infrastructure/repositories/post.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class GetPostsUseCase {
    private readonly postRepo;
    private readonly prisma;
    constructor(postRepo: PostRepository, prisma: PrismaService);
    execute(page: number, limit: number, tag?: string): Promise<{
        authorName: string | null;
        id: string;
        authorId: string;
        title: string;
        content: string;
        isAnonymous: boolean;
        images: string[];
        tags: string[];
        reactionUps: number;
        commentCount: number;
        isDeleted: boolean;
        isEdited: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
