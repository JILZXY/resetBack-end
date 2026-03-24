import { Model } from 'mongoose';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { PostDocument } from '../../forum/schemas/post.schema';
import { CommentDocument } from '../../forum/schemas/comment.schema';
import { ReactionDocument } from '../../forum/schemas/reaction.schema';
export declare class OverviewMetricsUseCase {
    private readonly prisma;
    private readonly postModel;
    private readonly commentModel;
    private readonly reactionModel;
    constructor(prisma: PrismaService, postModel: Model<PostDocument>, commentModel: Model<CommentDocument>, reactionModel: Model<ReactionDocument>);
    execute(): Promise<{
        users: {
            total: number;
            activeLoggers: number;
        };
        tracking: {
            totalLogs: number;
            totalStreaks: number;
            activeStreaks: number;
        };
        forum: {
            totalPosts: number;
            totalComments: number;
            totalReactions: number;
        };
    }>;
}
