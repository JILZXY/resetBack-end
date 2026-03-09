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
import { ToggleReactionUseCase } from './application/toggle-reaction.usecase';
import { CreateReportUseCase } from './application/create-report.usecase';
import { CreateEncouragementNoteUseCase } from './application/create-encouragement-note.usecase';
import { PostRepository } from './infrastructure/repositories/post.repository';
import { CommentRepository } from './infrastructure/repositories/comment.repository';
import { EncouragementNoteRepository } from './infrastructure/repositories/encouragement-note.repository';
import { CreatePostDto } from './infrastructure/dtos/create-post.dto';
import { UpdatePostDto } from './infrastructure/dtos/update-post.dto';
import { CreateCommentDto } from './infrastructure/dtos/create-comment.dto';
import { CreateReportDto } from './infrastructure/dtos/create-report.dto';
import { CreateEncouragementNoteDto } from './infrastructure/dtos/create-encouragement-note.dto';

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
    private readonly toggleReaction: ToggleReactionUseCase,
    private readonly createReport: CreateReportUseCase,
    private readonly createEncouragement: CreateEncouragementNoteUseCase,
    private readonly postRepo: PostRepository,
    private readonly commentRepo: CommentRepository,
    private readonly noteRepo: EncouragementNoteRepository,
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
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.updatePost.execute(req.user.userId, id, dto);
  }

  @Delete('posts/:id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.deletePost.execute(req.user.userId, id);
  }

  // Reacciones con toggle (prevención de duplicados)
  @Post('posts/:id/react')
  reactPost(@Request() req: any, @Param('id') id: string) {
    return this.toggleReaction.execute(req.user.userId, id, 'post');
  }

  @Post('comments/:id/react')
  reactComment(@Request() req: any, @Param('id') id: string) {
    return this.toggleReaction.execute(req.user.userId, id, 'comment');
  }

  // Reportes
  @Post('posts/:id/report')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  reportPost(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CreateReportDto,
  ) {
    return this.createReport.execute(req.user.userId, id, 'post', dto);
  }

  @Post('comments/:id/report')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  reportComment(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CreateReportDto,
  ) {
    return this.createReport.execute(req.user.userId, id, 'comment', dto);
  }

  // Comentarios
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

  // Notas de Aliento
  @Post('encouragement')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  sendEncouragement(
    @Request() req: any,
    @Body() dto: CreateEncouragementNoteDto,
  ) {
    return this.createEncouragement.execute(
      req.user.userId,
      dto.receiverId,
      dto.content,
    );
  }

  @Get('encouragement/my-notes')
  getMyNotes(@Request() req: any) {
    return this.noteRepo.findByReceiverId(req.user.userId);
  }
}
