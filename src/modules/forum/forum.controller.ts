import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostUseCase } from './application/create-post.usecase';
import { GetPostsUseCase } from './application/get-posts.usecase';
import { UpdatePostUseCase } from './application/update-post.usecase';
import { DeletePostUseCase } from './application/delete-post.usecase';
import { CreateCommentUseCase } from './application/create-comment.usecase';
import { DeleteCommentUseCase } from './application/delete-comment.usecase';
import { PostRepository } from './infrastructure/repositories/post.repository';
import { CommentRepository } from './infrastructure/repositories/comment.repository';
import { CreatePostDto } from './infrastructure/dtos/create-post.dto';
import { UpdatePostDto } from './infrastructure/dtos/update-post.dto';
import { CreateCommentDto } from './infrastructure/dtos/create-comment.dto';

@Controller('forum')
@UseGuards(JwtAuthGuard)
export class ForumController {
  constructor(
    private readonly createPost: CreatePostUseCase,
    private readonly getPosts: GetPostsUseCase,
    private readonly updatePost: UpdatePostUseCase,
    private readonly deletePost: DeletePostUseCase,
    private readonly createComment: CreateCommentUseCase,
    private readonly deleteComment: DeleteCommentUseCase,
    private readonly postRepo: PostRepository,
    private readonly commentRepo: CommentRepository,
  ) {}

  @Post('posts')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Request() req: any, @Body() dto: CreatePostDto) {
    return this.createPost.execute(req.user.userId, dto);
  }

  @Get('posts')
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('tag') tag?: string,
  ) {
    return this.getPosts.execute(Number(page), Number(limit), tag);
  }

  @Get('posts/:id')
  findOne(@Param('id') id: string) {
    return this.postRepo.findById(id);
  }

  @Get('posts/my/list')
  myPosts(@Request() req: any) {
    return this.postRepo.findByAuthorId(req.user.userId);
  }

  @Put('posts/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.updatePost.execute(req.user.userId, id, dto);
  }

  @Delete('posts/:id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.deletePost.execute(req.user.userId, id);
  }

  @Post('posts/:id/react')
  reactPost(@Param('id') id: string) {
    return this.postRepo.incrementReaction(id);
  }

  @Post('posts/:id/comments')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  addComment(
    @Request() req: any,
    @Param('id') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.createComment.execute(req.user.userId, postId, dto);
  }

  @Get('posts/:id/comments')
  getComments(@Param('id') postId: string) {
    return this.commentRepo.findByPostId(postId);
  }

  @Delete('comments/:id')
  removeComment(@Request() req: any, @Param('id') id: string) {
    return this.deleteComment.execute(req.user.userId, id);
  }

  @Post('comments/:id/react')
  reactComment(@Param('id') id: string) {
    return this.commentRepo.incrementReaction(id);
  }
}