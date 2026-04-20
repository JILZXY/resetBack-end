"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingModule = void 0;
const common_1 = require("@nestjs/common");
const tracking_controller_1 = require("./tracking.controller");
const daily_log_repository_1 = require("./infrastructure/repositories/daily-log.repository");
const create_log_usecase_1 = require("./application/create-log.usecase");
const get_log_history_usecase_1 = require("./application/get-log-history.usecase");
const get_statistics_usecase_1 = require("./application/get-statistics.usecase");
const latest_log_usecase_1 = require("./application/latest-log.usecase");
const moving_average_usecase_1 = require("./application/moving-average.usecase");
const absence_detection_service_1 = require("./application/absence-detection.service");
const sponsorship_module_1 = require("../sponsorship/sponsorship.module");
const streak_module_1 = require("../streak/streak.module");
let TrackingModule = class TrackingModule {
};
exports.TrackingModule = TrackingModule;
exports.TrackingModule = TrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [sponsorship_module_1.SponsorshipModule, streak_module_1.StreakModule],
        controllers: [tracking_controller_1.TrackingController],
        providers: [
            daily_log_repository_1.DailyLogRepository,
            create_log_usecase_1.CreateLogUseCase,
            get_log_history_usecase_1.GetLogHistoryUseCase,
            get_statistics_usecase_1.GetStatisticsUseCase,
            latest_log_usecase_1.LatestLogUseCase,
            moving_average_usecase_1.MovingAverageUseCase,
            absence_detection_service_1.AbsenceDetectionService,
        ],
        exports: [daily_log_repository_1.DailyLogRepository],
    })
], TrackingModule);
//# sourceMappingURL=tracking.module.js.map