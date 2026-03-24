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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const register_user_usecase_1 = require("./application/register-user.usecase");
const update_profile_usecase_1 = require("./application/update-profile.usecase");
const login_usecase_1 = require("./application/login.usecase");
const verify_2fa_usecase_1 = require("./application/verify-2fa.usecase");
const become_addict_usecase_1 = require("./application/become-addict.usecase");
const admin_login_usecase_1 = require("./application/admin-login.usecase");
const register_dto_1 = require("./infrastructure/dtos/register.dto");
const login_dto_1 = require("./infrastructure/dtos/login.dto");
const update_profile_dto_1 = require("./infrastructure/dtos/update-profile.dto");
const verify_2fa_dto_1 = require("./infrastructure/dtos/verify-2fa.dto");
const get_profile_usecase_1 = require("./application/get-profile.usecase");
const forgot_password_usecase_1 = require("./application/forgot-password.usecase");
const reset_password_usecase_1 = require("./application/reset-password.usecase");
const verify_email_usecase_1 = require("./application/verify-email.usecase");
const delete_account_usecase_1 = require("./application/delete-account.usecase");
const reset_password_dto_1 = require("./infrastructure/dtos/reset-password.dto");
const become_addict_dto_1 = require("./infrastructure/dtos/become-addict.dto");
const reactivate_dto_1 = require("./infrastructure/dtos/reactivate.dto");
const reactivate_account_usecase_1 = require("./application/reactivate-account.usecase");
const get_debug_token_usecase_1 = require("./application/get-debug-token.usecase");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthController = class AuthController {
    registerUseCase;
    loginUseCase;
    verify2FAUseCase;
    getProfileUseCase;
    forgotPasswordUseCase;
    resetPasswordUseCase;
    verifyEmailUseCase;
    deleteAccountUseCase;
    becomeAddictUseCase;
    reactivateAccountUseCase;
    updateProfileUseCase;
    getDebugTokenUseCase;
    adminLoginUseCase;
    constructor(registerUseCase, loginUseCase, verify2FAUseCase, getProfileUseCase, forgotPasswordUseCase, resetPasswordUseCase, verifyEmailUseCase, deleteAccountUseCase, becomeAddictUseCase, reactivateAccountUseCase, updateProfileUseCase, getDebugTokenUseCase, adminLoginUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.verify2FAUseCase = verify2FAUseCase;
        this.getProfileUseCase = getProfileUseCase;
        this.forgotPasswordUseCase = forgotPasswordUseCase;
        this.resetPasswordUseCase = resetPasswordUseCase;
        this.verifyEmailUseCase = verifyEmailUseCase;
        this.deleteAccountUseCase = deleteAccountUseCase;
        this.becomeAddictUseCase = becomeAddictUseCase;
        this.reactivateAccountUseCase = reactivateAccountUseCase;
        this.updateProfileUseCase = updateProfileUseCase;
        this.getDebugTokenUseCase = getDebugTokenUseCase;
        this.adminLoginUseCase = adminLoginUseCase;
    }
    register(dto) {
        return this.registerUseCase.execute(dto);
    }
    async login(dto, req, res) {
        const deviceIdFromCookie = req.cookies['device_id'];
        const result = await this.loginUseCase.execute(dto, deviceIdFromCookie);
        this.handleDeviceIdCookie(result, res);
        return result;
    }
    async adminLogin(dto) {
        return this.adminLoginUseCase.execute(dto);
    }
    async verify2FA(dto, res) {
        const result = await this.verify2FAUseCase.execute(dto);
        this.handleDeviceIdCookie(result, res);
        return result;
    }
    getProfile(req) {
        return this.getProfileUseCase.execute(req.user.userId);
    }
    forgotPassword(email) {
        return this.forgotPasswordUseCase.execute(email);
    }
    resetPassword(dto) {
        return this.resetPasswordUseCase.execute(dto);
    }
    verifyEmail(token) {
        return this.verifyEmailUseCase.execute(token);
    }
    deleteAccount(req) {
        return this.deleteAccountUseCase.execute(req.user.userId);
    }
    relapse(req, dto) {
        return this.becomeAddictUseCase.execute(req.user.userId, dto);
    }
    updateProfile(req, dto) {
        return this.updateProfileUseCase.execute(req.user.userId, dto);
    }
    reactivate(dto) {
        return this.reactivateAccountUseCase.execute(dto);
    }
    getDebugToken(req) {
        return this.getDebugTokenUseCase.execute(req.params.email);
    }
    handleDeviceIdCookie(result, res) {
        if (result && result.newDeviceId) {
            res.cookie('device_id', result.newDeviceId, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                partitioned: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            delete result.newDeviceId;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('admin-login'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogin", null);
__decorate([
    (0, common_1.Post)('verify-2fa'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_2fa_dto_1.Verify2FADto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2FA", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Delete)('account'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.Post)('relapse'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, become_addict_dto_1.BecomeAddictDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "relapse", null);
__decorate([
    (0, common_1.Post)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('reactivate'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reactivate_dto_1.ReactivateDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Get)('debug/last-token/:email'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getDebugToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [register_user_usecase_1.RegisterUserUseCase,
        login_usecase_1.LoginUseCase,
        verify_2fa_usecase_1.Verify2FAUseCase,
        get_profile_usecase_1.GetProfileUseCase,
        forgot_password_usecase_1.ForgotPasswordUseCase,
        reset_password_usecase_1.ResetPasswordUseCase,
        verify_email_usecase_1.VerifyEmailUseCase,
        delete_account_usecase_1.DeleteAccountUseCase,
        become_addict_usecase_1.BecomeAddictUseCase,
        reactivate_account_usecase_1.ReactivateAccountUseCase,
        update_profile_usecase_1.UpdateProfileUseCase,
        get_debug_token_usecase_1.GetDebugTokenUseCase,
        admin_login_usecase_1.AdminLoginUseCase])
], AuthController);
//# sourceMappingURL=auth.controller.js.map