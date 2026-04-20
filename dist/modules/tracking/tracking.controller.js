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
exports.TrackingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_log_usecase_1 = require("./application/create-log.usecase");
const get_log_history_usecase_1 = require("./application/get-log-history.usecase");
const get_statistics_usecase_1 = require("./application/get-statistics.usecase");
const latest_log_usecase_1 = require("./application/latest-log.usecase");
const moving_average_usecase_1 = require("./application/moving-average.usecase");
const create_log_dto_1 = require("./infrastructure/dtos/create-log.dto");
const log_filter_dto_1 = require("./infrastructure/dtos/log-filter.dto");
let TrackingController = class TrackingController {
    createLog;
    getHistory;
    getStats;
    latestLog;
    movingAverage;
    constructor(createLog, getHistory, getStats, latestLog, movingAverage) {
        this.createLog = createLog;
        this.getHistory = getHistory;
        this.getStats = getStats;
        this.latestLog = latestLog;
        this.movingAverage = movingAverage;
    }
    create(req, dto) {
        return this.createLog.execute(req.user.userId, dto);
    }
    history(req, filter, requestedUserId) {
        return this.getHistory.execute(req.user.userId, filter, requestedUserId);
    }
    statistics(req, requestedUserId) {
        return this.getStats.execute(req.user.userId, requestedUserId);
    }
    latest(req) {
        return this.latestLog.execute(req.user.userId);
    }
    movingAvg(req) {
        return this.movingAverage.execute(req.user.userId);
    }
};
exports.TrackingController = TrackingController;
__decorate([
    (0, common_1.Post)('logs'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_log_dto_1.CreateLogDto]),
    __metadata("design:returntype", void 0)
], TrackingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('logs'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, log_filter_dto_1.LogFilterDto, String]),
    __metadata("design:returntype", void 0)
], TrackingController.prototype, "history", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TrackingController.prototype, "statistics", null);
__decorate([
    (0, common_1.Get)('logs/latest'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrackingController.prototype, "latest", null);
__decorate([
    (0, common_1.Get)('stats/moving-average'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrackingController.prototype, "movingAvg", null);
exports.TrackingController = TrackingController = __decorate([
    (0, common_1.Controller)('tracking'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [create_log_usecase_1.CreateLogUseCase,
        get_log_history_usecase_1.GetLogHistoryUseCase,
        get_statistics_usecase_1.GetStatisticsUseCase,
        latest_log_usecase_1.LatestLogUseCase,
        moving_average_usecase_1.MovingAverageUseCase])
], TrackingController);
//# sourceMappingURL=tracking.controller.js.map