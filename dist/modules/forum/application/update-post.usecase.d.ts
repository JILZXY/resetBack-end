import { PostRepository } from '../infrastructure/repositories/post.repository';
import { UpdatePostDto } from '../infrastructure/dtos/update-post.dto';
export declare class UpdatePostUseCase {
    private readonly postRepo;
    constructor(postRepo: PostRepository);
    execute(userId: string, postId: string, dto: UpdatePostDto): Promise<import("../domain/post.entity").PostEntity | null>;
}
