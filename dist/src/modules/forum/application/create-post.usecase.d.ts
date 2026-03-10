import { PostRepository } from '../infrastructure/repositories/post.repository';
import { CreatePostDto } from '../infrastructure/dtos/create-post.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class CreatePostUseCase {
    private readonly postRepo;
    private readonly prisma;
    constructor(postRepo: PostRepository, prisma: PrismaService);
    execute(userId: string, dto: CreatePostDto): Promise<import("../domain/post.entity").PostEntity>;
}
