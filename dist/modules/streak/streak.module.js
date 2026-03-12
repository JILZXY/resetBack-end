"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreakModule = void 0;
const common_1 = require("@nestjs/common");
const streak_controller_1 = require("./streak.controller");
const streak_repository_1 = require("./infrastructure/repositories/streak.repository");
const streak_event_repository_1 = require("./infrastructure/repositories/streak-event.repository");
const create_streak_usecase_1 = require("./application/create-streak.usecase");
const reset_streak_usecase_1 = require("./application/reset-streak.usecase");
const best_streaks_usecase_1 = require("./application/best-streaks.usecase");
let StreakModule = class StreakModule {
};
exports.StreakModule = StreakModule;
exports.StreakModule = StreakModule = __decorate([
    (0, common_1.Module)({
        controllers: [streak_controller_1.StreakController],
        providers: [
            streak_repository_1.StreakRepository,
            streak_event_repository_1.StreakEventRepository,
            create_streak_usecase_1.CreateStreakUseCase,
            reset_streak_usecase_1.ResetStreakUseCase,
            best_streaks_usecase_1.BestStreaksUseCase,
        ],
        exports: [create_streak_usecase_1.CreateStreakUseCase, streak_repository_1.StreakRepository],
    })
], StreakModule);
//# sourceMappingURL=streak.module.js.map