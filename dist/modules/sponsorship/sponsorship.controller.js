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
exports.SponsorshipController = void 0;
const common_1 = require("@nestjs/common");
const assign_sponsor_usecase_1 = require("./application/assign-sponsor.usecase");
const accept_sponsorship_usecase_1 = require("./application/accept-sponsorship.usecase");
const reject_sponsorship_usecase_1 = require("./application/reject-sponsorship.usecase");
const terminate_sponsorship_usecase_1 = require("./application/terminate-sponsorship.usecase");
const graduate_sponsor_usecase_1 = require("./application/graduate-sponsor.usecase");
const get_godchild_profile_usecase_1 = require("./application/get-godchild-profile.usecase");
const request_sponsorship_dto_1 = require("./infrastructure/dtos/request-sponsorship.dto");
const terminate_sponsorship_dto_1 = require("./infrastructure/dtos/terminate-sponsorship.dto");
const graduate_addict_dto_1 = require("./infrastructure/dtos/graduate-addict.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SponsorshipController = class SponsorshipController {
    requestUseCase;
    acceptUseCase;
    rejectUseCase;
    terminateUseCase;
    graduateUseCase;
    godchildProfileUseCase;
    constructor(requestUseCase, acceptUseCase, rejectUseCase, terminateUseCase, graduateUseCase, godchildProfileUseCase) {
        this.requestUseCase = requestUseCase;
        this.acceptUseCase = acceptUseCase;
        this.rejectUseCase = rejectUseCase;
        this.terminateUseCase = terminateUseCase;
        this.graduateUseCase = graduateUseCase;
        this.godchildProfileUseCase = godchildProfileUseCase;
    }
    async request(req, dto) {
        return await this.requestUseCase.execute(req.user.userId, dto);
    }
    async accept(req) {
        return await this.acceptUseCase.execute(req.user.userId);
    }
    async reject(req) {
        return await this.rejectUseCase.execute(req.user.userId);
    }
    async terminate(req, sponsorshipId, dto) {
        return await this.terminateUseCase.execute(req.user.userId, sponsorshipId, dto);
    }
    async graduate(req, dto) {
        return await this.graduateUseCase.execute(req.user.userId, dto.addictId);
    }
    async godchildProfile(req) {
        return await this.godchildProfileUseCase.execute(req.user.userId);
    }
};
exports.SponsorshipController = SponsorshipController;
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_sponsorship_dto_1.RequestSponsorshipDto]),
    __metadata("design:returntype", Promise)
], SponsorshipController.prototype, "request", null);
__decorate([
    (0, common_1.Patch)('accept'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SponsorshipController.prototype, "accept", null);
__decorate([
    (0, common_1.Patch)('reject'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SponsorshipController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(':id/terminate'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, terminate_sponsorship_dto_1.TerminateSponsorshipDto]),
    __metadata("design:returntype", Promise)
], SponsorshipController.prototype, "terminate", null);
__decorate([
    (0, common_1.Post)('graduate'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, graduate_addict_dto_1.GraduateAddictDto]),
    __metadata("design:returntype", Promise)
], SponsorshipController.prototype, "graduate", null);
__decorate([
    (0, common_1.Get)('godchild/profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SponsorshipController.prototype, "godchildProfile", null);
exports.SponsorshipController = SponsorshipController = __decorate([
    (0, common_1.Controller)('sponsorships'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [assign_sponsor_usecase_1.RequestSponsorshipUseCase,
        accept_sponsorship_usecase_1.AcceptSponsorshipUseCase,
        reject_sponsorship_usecase_1.RejectSponsorshipUseCase,
        terminate_sponsorship_usecase_1.TerminateSponsorshipUseCase,
        graduate_sponsor_usecase_1.GraduateSponsorUseCase,
        get_godchild_profile_usecase_1.GetGodchildProfileUseCase])
], SponsorshipController);
//# sourceMappingURL=sponsorship.controller.js.map