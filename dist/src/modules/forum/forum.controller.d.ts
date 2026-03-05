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
export declare class ForumController {
    private readonly createPost;
    private readonly getPosts;
    private readonly updatePost;
    private readonly deletePost;
    private readonly createComment;
    private readonly deleteComment;
    private readonly toggleReaction;
    private readonly createReport;
    private readonly createEncouragement;
    private readonly postRepo;
    private readonly commentRepo;
    private readonly noteRepo;
    constructor(createPost: CreatePostUseCase, getPosts: GetPostsUseCase, updatePost: UpdatePostUseCase, deletePost: DeletePostUseCase, createComment: CreateCommentUseCase, deleteComment: DeleteCommentUseCase, toggleReaction: ToggleReactionUseCase, createReport: CreateReportUseCase, createEncouragement: CreateEncouragementNoteUseCase, postRepo: PostRepository, commentRepo: CommentRepository, noteRepo: EncouragementNoteRepository);
    create(req: any, dto: CreatePostDto): Promise<import("./domain/post.entity").PostEntity>;
    findAll(page?: string, limit?: string, tag?: string): Promise<{
        authorName: string | null;
        id: string;
        authorId: string;
        title: string;
        content: string;
        isAnonymous: boolean;
        images: string[];
        tags: string[];
        reactionUps: number;
        commentCount: number;
        isDeleted: boolean;
        isEdited: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<import("./domain/post.entity").PostEntity | null>;
    myPosts(req: any): Promise<import("./domain/post.entity").PostEntity[]>;
    update(req: any, id: string, dto: UpdatePostDto): Promise<import("./domain/post.entity").PostEntity | null>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
    reactPost(req: any, id: string): Promise<{
        action: string;
        message: string;
    }>;
    reactComment(req: any, id: string): Promise<{
        action: string;
        message: string;
    }>;
    reportPost(req: any, id: string, dto: CreateReportDto): Promise<{
        message: string;
        reportId: string;
    }>;
    reportComment(req: any, id: string, dto: CreateReportDto): Promise<{
        message: string;
        reportId: string;
    }>;
    addComment(req: any, postId: string, dto: CreateCommentDto): Promise<import("./domain/comment.entity").CommentEntity>;
    getComments(postId: string): Promise<import("./domain/comment.entity").CommentEntity[]>;
    removeComment(req: any, id: string): Promise<{
        message: string;
    }>;
    sendEncouragement(req: any, dto: CreateEncouragementNoteDto): Promise<import("./domain/encouragement-note.entity").EncouragementNoteEntity>;
    getMyNotes(req: any): Promise<import("./domain/encouragement-note.entity").EncouragementNoteEntity[]>;
}
