"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./shared/database/prisma/prisma.module");
const app_config_1 = require("./config/app.config");
const database_config_1 = require("./config/database.config");
const jwt_config_1 = require("./config/jwt.config");
const mongo_config_1 = require("./config/mongo.config");
const sendgrid_config_1 = require("./config/sendgrid.config");
const auth_module_1 = require("./modules/auth/auth.module");
const tracking_module_1 = require("./modules/tracking/tracking.module");
const streak_module_1 = require("./modules/streak/streak.module");
const emergency_module_1 = require("./modules/emergency/emergency.module");
const forum_module_1 = require("./modules/forum/forum.module");
const sponsorship_module_1 = require("./modules/sponsorship/sponsorship.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: process.env.NODE_ENV === 'production'
                    ? '.env.production'
                    : '.env.development',
                load: [app_config_1.appConfig, database_config_1.databaseConfig, jwt_config_1.jwtConfig, mongo_config_1.mongoConfig, sendgrid_config_1.sendgridConfig],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('mongo.url'),
                }),
                inject: [config_1.ConfigService],
            }),
            prisma_module_1.PrismaModule,
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            tracking_module_1.TrackingModule,
            streak_module_1.StreakModule,
            emergency_module_1.EmergencyModule,
            forum_module_1.ForumModule,
            sponsorship_module_1.SponsorshipModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map