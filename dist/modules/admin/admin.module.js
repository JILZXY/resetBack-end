"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_controller_1 = require("./admin.controller");
const overview_metrics_usecase_1 = require("./application/overview-metrics.usecase");
const logs_frequency_usecase_1 = require("./application/logs-frequency.usecase");
const forum_engagement_usecase_1 = require("./application/forum-engagement.usecase");
const correlation_metrics_usecase_1 = require("./application/correlation-metrics.usecase");
const logs_by_addiction_usecase_1 = require("./application/logs-by-addiction.usecase");
const emotional_trends_usecase_1 = require("./application/emotional-trends.usecase");
const streaks_summary_usecase_1 = require("./application/streaks-summary.usecase");
const reports_summary_usecase_1 = require("./application/reports-summary.usecase");
const post_schema_1 = require("../forum/schemas/post.schema");
const comment_schema_1 = require("../forum/schemas/comment.schema");
const reaction_schema_1 = require("../forum/schemas/reaction.schema");
const report_schema_1 = require("../forum/schemas/report.schema");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: post_schema_1.Post.name, schema: post_schema_1.PostSchema },
                { name: comment_schema_1.Comment.name, schema: comment_schema_1.CommentSchema },
                { name: reaction_schema_1.Reaction.name, schema: reaction_schema_1.ReactionSchema },
                { name: report_schema_1.Report.name, schema: report_schema_1.ReportSchema },
            ]),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [
            overview_metrics_usecase_1.OverviewMetricsUseCase,
            logs_frequency_usecase_1.LogsFrequencyUseCase,
            forum_engagement_usecase_1.ForumEngagementUseCase,
            correlation_metrics_usecase_1.CorrelationMetricsUseCase,
            logs_by_addiction_usecase_1.LogsByAddictionUseCase,
            emotional_trends_usecase_1.EmotionalTrendsUseCase,
            streaks_summary_usecase_1.StreaksSummaryUseCase,
            reports_summary_usecase_1.ReportsSummaryUseCase,
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map