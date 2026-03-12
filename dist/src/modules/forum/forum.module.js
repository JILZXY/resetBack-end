"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const forum_controller_1 = require("./forum.controller");
const notification_controller_1 = require("./notification.controller");
const notification_gateway_1 = require("./notification.gateway");
const auth_module_1 = require("../auth/auth.module");
const post_schema_1 = require("./schemas/post.schema");
const comment_schema_1 = require("./schemas/comment.schema");
const reaction_schema_1 = require("./schemas/reaction.schema");
const report_schema_1 = require("./schemas/report.schema");
const notification_schema_1 = require("./schemas/notification.schema");
const post_repository_1 = require("./infrastructure/repositories/post.repository");
const comment_repository_1 = require("./infrastructure/repositories/comment.repository");
const reaction_repository_1 = require("./infrastructure/repositories/reaction.repository");
const report_repository_1 = require("./infrastructure/repositories/report.repository");
const notification_repository_1 = require("./infrastructure/repositories/notification.repository");
const create_post_usecase_1 = require("./application/create-post.usecase");
const get_posts_usecase_1 = require("./application/get-posts.usecase");
const update_post_usecase_1 = require("./application/update-post.usecase");
const delete_post_usecase_1 = require("./application/delete-post.usecase");
const create_comment_usecase_1 = require("./application/create-comment.usecase");
const delete_comment_usecase_1 = require("./application/delete-comment.usecase");
const toggle_reaction_usecase_1 = require("./application/toggle-reaction.usecase");
const create_report_usecase_1 = require("./application/create-report.usecase");
let ForumModule = class ForumModule {
};
exports.ForumModule = ForumModule;
exports.ForumModule = ForumModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            mongoose_1.MongooseModule.forFeature([
                { name: post_schema_1.Post.name, schema: post_schema_1.PostSchema },
                { name: comment_schema_1.Comment.name, schema: comment_schema_1.CommentSchema },
                { name: reaction_schema_1.Reaction.name, schema: reaction_schema_1.ReactionSchema },
                { name: report_schema_1.Report.name, schema: report_schema_1.ReportSchema },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
            ]),
        ],
        controllers: [forum_controller_1.ForumController, notification_controller_1.NotificationController],
        providers: [
            post_repository_1.PostRepository,
            comment_repository_1.CommentRepository,
            reaction_repository_1.ReactionRepository,
            report_repository_1.ReportRepository,
            notification_repository_1.NotificationRepository,
            notification_gateway_1.NotificationGateway,
            create_post_usecase_1.CreatePostUseCase,
            get_posts_usecase_1.GetPostsUseCase,
            update_post_usecase_1.UpdatePostUseCase,
            delete_post_usecase_1.DeletePostUseCase,
            create_comment_usecase_1.CreateCommentUseCase,
            delete_comment_usecase_1.DeleteCommentUseCase,
            toggle_reaction_usecase_1.ToggleReactionUseCase,
            create_report_usecase_1.CreateReportUseCase,
        ],
        exports: [notification_repository_1.NotificationRepository, notification_gateway_1.NotificationGateway],
    })
], ForumModule);
//# sourceMappingURL=forum.module.js.map