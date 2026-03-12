"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_post_usecase_1 = require("./application/create-post.usecase");
const get_posts_usecase_1 = require("./application/get-posts.usecase");
const update_post_usecase_1 = require("./application/update-post.usecase");
const delete_post_usecase_1 = require("./application/delete-post.usecase");
const create_comment_usecase_1 = require("./application/create-comment.usecase");
const delete_comment_usecase_1 = require("./application/delete-comment.usecase");
const toggle_reaction_usecase_1 = require("./application/toggle-reaction.usecase");
const create_report_usecase_1 = require("./application/create-report.usecase");
const create_encouragement_note_usecase_1 = require("./application/create-encouragement-note.usecase");
const post_repository_1 = require("./infrastructure/repositories/post.repository");
const comment_repository_1 = require("./infrastructure/repositories/comment.repository");
const encouragement_note_repository_1 = require("./infrastructure/repositories/encouragement-note.repository");
const create_post_dto_1 = require("./infrastructure/dtos/create-post.dto");
const update_post_dto_1 = require("./infrastructure/dtos/update-post.dto");
const create_comment_dto_1 = require("./infrastructure/dtos/create-comment.dto");
const create_report_dto_1 = require("./infrastructure/dtos/create-report.dto");
const create_encouragement_note_dto_1 = require("./infrastructure/dtos/create-encouragement-note.dto");
let ForumController = class ForumController {
    createPost;
    getPosts;
    updatePost;
    deletePost;
    createComment;
    deleteComment;
    toggleReaction;
    createReport;
    createEncouragement;
    postRepo;
    commentRepo;
    noteRepo;
    constructor(createPost, getPosts, updatePost, deletePost, createComment, deleteComment, toggleReaction, createReport, createEncouragement, postRepo, commentRepo, noteRepo) {
        this.createPost = createPost;
        this.getPosts = getPosts;
        this.updatePost = updatePost;
        this.deletePost = deletePost;
        this.createComment = createComment;
        this.deleteComment = deleteComment;
        this.toggleReaction = toggleReaction;
        this.createReport = createReport;
        this.createEncouragement = createEncouragement;
        this.postRepo = postRepo;
        this.commentRepo = commentRepo;
        this.noteRepo = noteRepo;
    }
    create(req, dto) {
        return this.createPost.execute(req.user.userId, dto);
    }
    findAll(page = '1', limit = '10', tag) {
        return this.getPosts.execute(Number(page), Number(limit), tag);
    }
    findOne(id) {
        return this.postRepo.findById(id);
    }
    myPosts(req) {
        return this.postRepo.findByAuthorId(req.user.userId);
    }
    update(req, id, dto) {
        return this.updatePost.execute(req.user.userId, id, dto);
    }
    remove(req, id) {
        return this.deletePost.execute(req.user.userId, id);
    }
    reactPost(req, id) {
        return this.toggleReaction.execute(req.user.userId, id, 'post');
    }
    reactComment(req, id) {
        return this.toggleReaction.execute(req.user.userId, id, 'comment');
    }
    reportPost(req, id, dto) {
        return this.createReport.execute(req.user.userId, id, 'post', dto);
    }
    reportComment(req, id, dto) {
        return this.createReport.execute(req.user.userId, id, 'comment', dto);
    }
    addComment(req, postId, dto) {
        return this.createComment.execute(req.user.userId, postId, dto);
    }
    getComments(postId) {
        return this.commentRepo.findByPostId(postId);
    }
    removeComment(req, id) {
        return this.deleteComment.execute(req.user.userId, id);
    }
    sendEncouragement(req, dto) {
        return this.createEncouragement.execute(req.user.userId, dto.receiverId, dto.content);
    }
    getMyNotes(req) {
        return this.noteRepo.findByReceiverId(req.user.userId);
    }
};
exports.ForumController = ForumController;
__decorate([
    (0, common_1.Post)('posts'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('posts'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('posts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('posts/my/list'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "myPosts", null);
__decorate([
    (0, common_1.Put)('posts/:id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('posts/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('posts/:id/react'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "reactPost", null);
__decorate([
    (0, common_1.Post)('comments/:id/react'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "reactComment", null);
__decorate([
    (0, common_1.Post)('posts/:id/report'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_report_dto_1.CreateReportDto]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "reportPost", null);
__decorate([
    (0, common_1.Post)('comments/:id/report'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_report_dto_1.CreateReportDto]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "reportComment", null);
__decorate([
    (0, common_1.Post)('posts/:id/comments'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)('posts/:id/comments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "getComments", null);
__decorate([
    (0, common_1.Delete)('comments/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "removeComment", null);
__decorate([
    (0, common_1.Post)('encouragement'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_encouragement_note_dto_1.CreateEncouragementNoteDto]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "sendEncouragement", null);
__decorate([
    (0, common_1.Get)('encouragement/my-notes'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "getMyNotes", null);
exports.ForumController = ForumController = __decorate([
    (0, common_1.Controller)('forum'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [create_post_usecase_1.CreatePostUseCase,
        get_posts_usecase_1.GetPostsUseCase,
        update_post_usecase_1.UpdatePostUseCase,
        delete_post_usecase_1.DeletePostUseCase,
        create_comment_usecase_1.CreateCommentUseCase,
        delete_comment_usecase_1.DeleteCommentUseCase,
        toggle_reaction_usecase_1.ToggleReactionUseCase,
        create_report_usecase_1.CreateReportUseCase,
        create_encouragement_note_usecase_1.CreateEncouragementNoteUseCase,
        post_repository_1.PostRepository,
        comment_repository_1.CommentRepository,
        encouragement_note_repository_1.EncouragementNoteRepository])
], ForumController);
//# sourceMappingURL=forum.controller.js.map