import { Model } from 'mongoose';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';
import { PostDocument } from '../../forum/schemas/post.schema';
import { CommentDocument } from '../../forum/schemas/comment.schema';
import { ReactionDocument } from '../../forum/schemas/reaction.schema';
export declare class ForumEngagementUseCase {
    private readonly postModel;
    private readonly commentModel;
    private readonly reactionModel;
    constructor(postModel: Model<PostDocument>, commentModel: Model<CommentDocument>, reactionModel: Model<ReactionDocument>);
    execute(filter: MetricsFilterDto): Promise<{
        summary: {
            totalPosts: number;
            totalComments: number;
            totalReactions: number;
            uniqueForumUsers: number;
            uniquePostAuthors: number;
            uniqueCommenters: number;
        };
        postsByDay: {
            date: any;
            count: any;
        }[];
    }>;
}
