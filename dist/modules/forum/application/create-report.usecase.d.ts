import { ReportRepository } from '../infrastructure/repositories/report.repository';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { CreateReportDto } from '../infrastructure/dtos/create-report.dto';
export declare class CreateReportUseCase {
    private readonly reportRepo;
    private readonly postRepo;
    private readonly commentRepo;
    constructor(reportRepo: ReportRepository, postRepo: PostRepository, commentRepo: CommentRepository);
    execute(userId: string, targetId: string, targetType: 'post' | 'comment', dto: CreateReportDto): Promise<{
        message: string;
        reportId: string;
    }>;
}
