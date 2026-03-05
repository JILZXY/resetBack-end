import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Post, PostDocument } from '../../forum/schemas/post.schema';
import { Comment, CommentDocument } from '../../forum/schemas/comment.schema';
import { Reaction, ReactionDocument } from '../../forum/schemas/reaction.schema';

@Injectable()
export class OverviewMetricsUseCase {
  constructor(
    private readonly prisma: PrismaService,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Reaction.name) private readonly reactionModel: Model<ReactionDocument>,
  ) {}

  async execute() {
    // PostgreSQL metrics via Prisma
    const [totalUsers, totalLogs, totalStreaks, activeStreaks] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.dailyLog.count(),
      this.prisma.streak.count(),
      this.prisma.streak.count({ where: { status: 'active' } }),
    ]);

    // MongoDB metrics via Mongoose
    const [totalPosts, totalComments, totalReactions] = await Promise.all([
      this.postModel.countDocuments({ isDeleted: false }),
      this.commentModel.countDocuments({ isDeleted: false }),
      this.reactionModel.countDocuments(),
    ]);

    // Usuarios únicos que han hecho al menos un log
    const usersWithLogs = await this.prisma.dailyLog.groupBy({
      by: ['user_id'],
    });

    return {
      users: {
        total: totalUsers,
        activeLoggers: usersWithLogs.length,
      },
      tracking: {
        totalLogs,
        totalStreaks,
        activeStreaks,
      },
      forum: {
        totalPosts,
        totalComments,
        totalReactions,
      },
    };
  }
}
