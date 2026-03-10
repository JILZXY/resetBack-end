"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsorshipModule = void 0;
const common_1 = require("@nestjs/common");
const sponsorship_controller_1 = require("./sponsorship.controller");
const assign_sponsor_usecase_1 = require("./application/assign-sponsor.usecase");
const accept_sponsorship_usecase_1 = require("./application/accept-sponsorship.usecase");
const reject_sponsorship_usecase_1 = require("./application/reject-sponsorship.usecase");
const terminate_sponsorship_usecase_1 = require("./application/terminate-sponsorship.usecase");
const graduate_sponsor_usecase_1 = require("./application/graduate-sponsor.usecase");
const get_godchild_profile_usecase_1 = require("./application/get-godchild-profile.usecase");
const sponsorship_repository_1 = require("./infrastructure/repositories/sponsorship.repository");
const auth_module_1 = require("../auth/auth.module");
const forum_module_1 = require("../forum/forum.module");
const emergency_module_1 = require("../emergency/emergency.module");
const prisma_module_1 = require("../../shared/database/prisma/prisma.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let SponsorshipModule = class SponsorshipModule {
};
exports.SponsorshipModule = SponsorshipModule;
exports.SponsorshipModule = SponsorshipModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            forum_module_1.ForumModule,
            emergency_module_1.EmergencyModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [sponsorship_controller_1.SponsorshipController],
        providers: [
            sponsorship_repository_1.SponsorshipRepository,
            assign_sponsor_usecase_1.RequestSponsorshipUseCase,
            accept_sponsorship_usecase_1.AcceptSponsorshipUseCase,
            reject_sponsorship_usecase_1.RejectSponsorshipUseCase,
            terminate_sponsorship_usecase_1.TerminateSponsorshipUseCase,
            graduate_sponsor_usecase_1.GraduateSponsorUseCase,
            get_godchild_profile_usecase_1.GetGodchildProfileUseCase,
        ],
        exports: [sponsorship_repository_1.SponsorshipRepository],
    })
], SponsorshipModule);
//# sourceMappingURL=sponsorship.module.js.map