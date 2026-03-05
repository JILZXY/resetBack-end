import { Model } from 'mongoose';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';
import { PostDocument } from '../../forum/schemas/post.schema';
import { CommentDocument } from '../../forum/schemas/comment.schema';
export declare class CorrelationMetricsUseCase {
    private readonly prisma;
    private readonly postModel;
    private readonly commentModel;
    constructor(prisma: PrismaService, postModel: Model<PostDocument>, commentModel: Model<CommentDocument>);
    execute(filter: MetricsFilterDto): Promise<{
        forumUsers: {
            avgLogsPerUser: number;
            avgCraving: number | null;
            avgEmotion: number | null;
            avgStreakDays: number;
            relapseRate: number;
            count: number;
        };
        nonForumUsers: {
            avgLogsPerUser: number;
            avgCraving: number | null;
            avgEmotion: number | null;
            avgStreakDays: number;
            relapseRate: number;
            count: number;
        };
    }>;
    private getGroupMetrics;
}
