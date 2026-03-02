import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumController } from './forum.controller';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from '../auth/auth.module';
import { Post, PostSchema } from './schemas/post.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { Report, ReportSchema } from './schemas/report.schema';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { PostRepository } from './infrastructure/repositories/post.repository';
import { CommentRepository } from './infrastructure/repositories/comment.repository';
import { ReactionRepository } from './infrastructure/repositories/reaction.repository';
import { ReportRepository } from './infrastructure/repositories/report.repository';
import { NotificationRepository } from './infrastructure/repositories/notification.repository';
import { CreatePostUseCase } from './application/create-post.usecase';
import { GetPostsUseCase } from './application/get-posts.usecase';
import { UpdatePostUseCase } from './application/update-post.usecase';
import { DeletePostUseCase } from './application/delete-post.usecase';
import { CreateCommentUseCase } from './application/create-comment.usecase';
import { DeleteCommentUseCase } from './application/delete-comment.usecase';
import { ToggleReactionUseCase } from './application/toggle-reaction.usecase';
import { CreateReportUseCase } from './application/create-report.usecase';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Reaction.name, schema: ReactionSchema },
      { name: Report.name, schema: ReportSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [ForumController, NotificationController],
  providers: [
    PostRepository,
    CommentRepository,
    ReactionRepository,
    ReportRepository,
    NotificationRepository,
    NotificationGateway,
    CreatePostUseCase,
    GetPostsUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    CreateCommentUseCase,
    DeleteCommentUseCase,
    ToggleReactionUseCase,
    CreateReportUseCase,
  ],
})
export class ForumModule {}
