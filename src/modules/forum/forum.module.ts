import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumController } from './forum.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { PostRepository } from './infrastructure/repositories/post.repository';
import { CommentRepository } from './infrastructure/repositories/comment.repository';
import { CreatePostUseCase } from './application/create-post.usecase';
import { GetPostsUseCase } from './application/get-posts.usecase';
import { UpdatePostUseCase } from './application/update-post.usecase';
import { DeletePostUseCase } from './application/delete-post.usecase';
import { CreateCommentUseCase } from './application/create-comment.usecase';
import { DeleteCommentUseCase } from './application/delete-comment.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [ForumController],
  providers: [
    PostRepository,
    CommentRepository,
    CreatePostUseCase,
    GetPostsUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    CreateCommentUseCase,
    DeleteCommentUseCase,
  ],
})
export class ForumModule {}