import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';
import { Post, PostDocument } from '../../forum/schemas/post.schema';
import { Comment, CommentDocument } from '../../forum/schemas/comment.schema';
import {
  Reaction,
  ReactionDocument,
} from '../../forum/schemas/reaction.schema';

@Injectable()
export class ForumEngagementUseCase {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<ReactionDocument>,
  ) {}

  async execute(filter: MetricsFilterDto) {
    const dateFilter: any = {};
    if (filter.from) dateFilter.$gte = new Date(filter.from);
    if (filter.to) dateFilter.$lte = new Date(filter.to);
    const hasDateFilter = Object.keys(dateFilter).length > 0;

    const postQuery: any = { isDeleted: false };
    const commentQuery: any = { isDeleted: false };
    const reactionQuery: any = {};
    if (hasDateFilter) {
      postQuery.createdAt = dateFilter;
      commentQuery.createdAt = dateFilter;
      reactionQuery.createdAt = dateFilter;
    }

    const [totalPosts, totalComments, totalReactions] = await Promise.all([
      this.postModel.countDocuments(postQuery),
      this.commentModel.countDocuments(commentQuery),
      this.reactionModel.countDocuments(reactionQuery),
    ]);

    const uniquePostAuthors = await this.postModel.distinct(
      'authorId',
      postQuery,
    );

    const uniqueCommentAuthors = await this.commentModel.distinct(
      'authorId',
      commentQuery,
    );

    const uniqueReactors = await this.reactionModel.distinct(
      'userId',
      reactionQuery,
    );

    const allForumUsers = new Set([
      ...uniquePostAuthors,
      ...uniqueCommentAuthors,
      ...uniqueReactors,
    ]);

    const postsByDay = await this.postModel.aggregate([
      { $match: postQuery },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      summary: {
        totalPosts,
        totalComments,
        totalReactions,
        uniqueForumUsers: allForumUsers.size,
        uniquePostAuthors: uniquePostAuthors.length,
        uniqueCommenters: uniqueCommentAuthors.length,
      },
      postsByDay: postsByDay.map((d) => ({
        date: d._id,
        count: d.count,
      })),
    };
  }
}
