import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { OverviewMetricsUseCase } from './application/overview-metrics.usecase';
import { LogsFrequencyUseCase } from './application/logs-frequency.usecase';
import { ForumEngagementUseCase } from './application/forum-engagement.usecase';
import { CorrelationMetricsUseCase } from './application/correlation-metrics.usecase';
import { LogsByAddictionUseCase } from './application/logs-by-addiction.usecase';
import { EmotionalTrendsUseCase } from './application/emotional-trends.usecase';
import { StreaksSummaryUseCase } from './application/streaks-summary.usecase';
import { ReportsSummaryUseCase } from './application/reports-summary.usecase';
import { Post, PostSchema } from '../forum/schemas/post.schema';
import { Comment, CommentSchema } from '../forum/schemas/comment.schema';
import { Reaction, ReactionSchema } from '../forum/schemas/reaction.schema';
import { Report, ReportSchema } from '../forum/schemas/report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Reaction.name, schema: ReactionSchema },
      { name: Report.name, schema: ReportSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [
    OverviewMetricsUseCase,
    LogsFrequencyUseCase,
    ForumEngagementUseCase,
    CorrelationMetricsUseCase,
    LogsByAddictionUseCase,
    EmotionalTrendsUseCase,
    StreaksSummaryUseCase,
    ReportsSummaryUseCase,
  ],
})
export class AdminModule {}
