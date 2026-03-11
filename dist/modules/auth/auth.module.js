"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const user_repository_1 = require("./infrastructure/repositories/user.repository");
const register_user_usecase_1 = require("./application/register-user.usecase");
const login_usecase_1 = require("./application/login.usecase");
const get_profile_usecase_1 = require("./application/get-profile.usecase");
const forgot_password_usecase_1 = require("./application/forgot-password.usecase");
const reset_password_usecase_1 = require("./application/reset-password.usecase");
const verify_email_usecase_1 = require("./application/verify-email.usecase");
const delete_account_usecase_1 = require("./application/delete-account.usecase");
const password_reset_token_repository_1 = require("./infrastructure/repositories/password-reset-token.repository");
const verification_token_repository_1 = require("./infrastructure/repositories/verification-token.repository");
const trusted_device_repository_1 = require("./infrastructure/repositories/trusted-device.repository");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET') ?? '',
                    signOptions: {
                        expiresIn: (config.get('JWT_EXPIRES_IN') ?? '7d'),
                    },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.JwtStrategy,
            user_repository_1.UserRepository,
            register_user_usecase_1.RegisterUserUseCase,
            login_usecase_1.LoginUseCase,
            get_profile_usecase_1.GetProfileUseCase,
            forgot_password_usecase_1.ForgotPasswordUseCase,
            reset_password_usecase_1.ResetPasswordUseCase,
            verify_email_usecase_1.VerifyEmailUseCase,
            delete_account_usecase_1.DeleteAccountUseCase,
            password_reset_token_repository_1.PasswordResetTokenRepository,
            verification_token_repository_1.VerificationTokenRepository,
            trusted_device_repository_1.TrustedDeviceRepository,
        ],
        exports: [jwt_1.JwtModule, user_repository_1.UserRepository],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map