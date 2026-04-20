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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const metrics_filter_dto_1 = require("./infrastructure/dtos/metrics-filter.dto");
const overview_metrics_usecase_1 = require("./application/overview-metrics.usecase");
const logs_frequency_usecase_1 = require("./application/logs-frequency.usecase");
const forum_engagement_usecase_1 = require("./application/forum-engagement.usecase");
const correlation_metrics_usecase_1 = require("./application/correlation-metrics.usecase");
const logs_by_addiction_usecase_1 = require("./application/logs-by-addiction.usecase");
const emotional_trends_usecase_1 = require("./application/emotional-trends.usecase");
const streaks_summary_usecase_1 = require("./application/streaks-summary.usecase");
const reports_summary_usecase_1 = require("./application/reports-summary.usecase");
let AdminController = class AdminController {
    overview;
    logsFrequency;
    forumEngagement;
    correlation;
    logsByAddiction;
    emotionalTrends;
    streaksSummary;
    reportsSummary;
    constructor(overview, logsFrequency, forumEngagement, correlation, logsByAddiction, emotionalTrends, streaksSummary, reportsSummary) {
        this.overview = overview;
        this.logsFrequency = logsFrequency;
        this.forumEngagement = forumEngagement;
        this.correlation = correlation;
        this.logsByAddiction = logsByAddiction;
        this.emotionalTrends = emotionalTrends;
        this.streaksSummary = streaksSummary;
        this.reportsSummary = reportsSummary;
    }
    getOverview() {
        return this.overview.execute();
    }
    getLogsFrequency(filter) {
        return this.logsFrequency.execute(filter);
    }
    getForumEngagement(filter) {
        return this.forumEngagement.execute(filter);
    }
    getCorrelation(filter) {
        return this.correlation.execute(filter);
    }
    getLogsByAddiction(filter) {
        return this.logsByAddiction.execute(filter);
    }
    getEmotionalTrends(filter) {
        return this.emotionalTrends.execute(filter);
    }
    getStreaksSummary() {
        return this.streaksSummary.execute();
    }
    getReportsSummary(filter) {
        return this.reportsSummary.execute(filter);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('logs-frequency'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metrics_filter_dto_1.MetricsFilterDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getLogsFrequency", null);
__decorate([
    (0, common_1.Get)('forum-engagement'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metrics_filter_dto_1.MetricsFilterDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getForumEngagement", null);
__decorate([
    (0, common_1.Get)('correlation'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metrics_filter_dto_1.MetricsFilterDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getCorrelation", null);
__decorate([
    (0, common_1.Get)('logs-by-addiction'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metrics_filter_dto_1.MetricsFilterDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getLogsByAddiction", null);
__decorate([
    (0, common_1.Get)('emotional-trends'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metrics_filter_dto_1.MetricsFilterDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getEmotionalTrends", null);
__decorate([
    (0, common_1.Get)('streaks-summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getStreaksSummary", null);
__decorate([
    (0, common_1.Get)('reports-summary'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metrics_filter_dto_1.MetricsFilterDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getReportsSummary", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin/metrics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.SetMetadata)(roles_guard_1.ROLES_KEY, ['ADMIN']),
    __metadata("design:paramtypes", [overview_metrics_usecase_1.OverviewMetricsUseCase,
        logs_frequency_usecase_1.LogsFrequencyUseCase,
        forum_engagement_usecase_1.ForumEngagementUseCase,
        correlation_metrics_usecase_1.CorrelationMetricsUseCase,
        logs_by_addiction_usecase_1.LogsByAddictionUseCase,
        emotional_trends_usecase_1.EmotionalTrendsUseCase,
        streaks_summary_usecase_1.StreaksSummaryUseCase,
        reports_summary_usecase_1.ReportsSummaryUseCase])
], AdminController);
//# sourceMappingURL=admin.controller.js.map