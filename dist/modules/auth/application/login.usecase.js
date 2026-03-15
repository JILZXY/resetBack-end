"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_repository_1 = require("../infrastructure/repositories/user.repository");
const trusted_device_repository_1 = require("../infrastructure/repositories/trusted-device.repository");
const verification_token_repository_1 = require("../infrastructure/repositories/verification-token.repository");
const mail_service_1 = require("../../../shared/mail/mail.service");
const bcrypt = __importStar(require("bcrypt"));
let LoginUseCase = class LoginUseCase {
    userRepo;
    jwtService;
    trustedDeviceRepo;
    tokenRepo;
    mailService;
    constructor(userRepo, jwtService, trustedDeviceRepo, tokenRepo, mailService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.trustedDeviceRepo = trustedDeviceRepo;
        this.tokenRepo = tokenRepo;
        this.mailService = mailService;
    }
    async execute(dto, deviceIdFromCookie) {
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user) {
            throw new common_1.HttpException({
                code: 'INVALID_CREDENTIALS',
                message: 'Correo o contraseña incorrectos',
                details: {},
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordMatch) {
            throw new common_1.HttpException({
                code: 'INVALID_CREDENTIALS',
                message: 'Correo o contraseña incorrectos',
                details: {},
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
        if (!user.isVerified) {
            throw new common_1.HttpException({
                code: 'EMAIL_NOT_VERIFIED',
                message: 'Debes verificar tu correo electrónico antes de iniciar sesión',
                details: { email: user.email },
            }, common_1.HttpStatus.FORBIDDEN);
        }
        if (deviceIdFromCookie) {
            const isTrusted = await this.trustedDeviceRepo.findValidDevice(user.id, deviceIdFromCookie);
            if (isTrusted) {
                await this.trustedDeviceRepo.updateLastUsed(isTrusted.id);
                return this.generateTokenResponse(user);
            }
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await this.tokenRepo.create(user.id, otpCode, expiresAt);
        await this.mailService.send2FACode(user.email, otpCode);
        const mfaToken = this.jwtService.sign({
            sub: user.id,
            type: 'mfa_challenge',
            rememberMe: dto.rememberMe
        }, { expiresIn: '15m' });
        return {
            code: '2FA_REQUIRED',
            message: 'Se ha enviado un código de seguridad a tu correo electrónico',
            mfaToken,
        };
    }
    generateTokenResponse(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            accessToken: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                sponsorCode: user.sponsorCode,
            },
        };
    }
};
exports.LoginUseCase = LoginUseCase;
exports.LoginUseCase = LoginUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        jwt_1.JwtService,
        trusted_device_repository_1.TrustedDeviceRepository,
        verification_token_repository_1.VerificationTokenRepository,
        mail_service_1.MailService])
], LoginUseCase);
//# sourceMappingURL=login.usecase.js.map