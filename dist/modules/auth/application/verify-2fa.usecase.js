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
exports.Verify2FAUseCase = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const verification_token_repository_1 = require("../infrastructure/repositories/verification-token.repository");
const trusted_device_repository_1 = require("../infrastructure/repositories/trusted-device.repository");
const user_repository_1 = require("../infrastructure/repositories/user.repository");
const crypto = __importStar(require("crypto"));
let Verify2FAUseCase = class Verify2FAUseCase {
    jwtService;
    tokenRepo;
    trustedDeviceRepo;
    userRepo;
    constructor(jwtService, tokenRepo, trustedDeviceRepo, userRepo) {
        this.jwtService = jwtService;
        this.tokenRepo = tokenRepo;
        this.trustedDeviceRepo = trustedDeviceRepo;
        this.userRepo = userRepo;
    }
    async execute(dto) {
        let payload;
        try {
            payload = this.jwtService.verify(dto.mfaToken);
        }
        catch (e) {
            throw new common_1.HttpException({ code: 'INVALID_MFA_TOKEN', message: 'El token de desafío ha expirado o es inválido' }, common_1.HttpStatus.UNAUTHORIZED);
        }
        if (payload.type !== 'mfa_challenge') {
            throw new common_1.HttpException({ code: 'INVALID_MFA_TOKEN', message: 'Token de desafío inválido' }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const userId = payload.sub;
        const tokenRecord = await this.tokenRepo.findByToken(dto.code);
        if (!tokenRecord || tokenRecord.user_id !== userId) {
            throw new common_1.HttpException({ code: 'INVALID_OTP_CODE', message: 'El código ingresado es incorrecto o ha expirado' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        await this.tokenRepo.delete(tokenRecord.id);
        const response = this.generateTokenResponse(user);
        let newDeviceId;
        if (payload.rememberMe) {
            newDeviceId = crypto.randomBytes(32).toString('hex');
            await this.trustedDeviceRepo.create(user.id, newDeviceId, 'Dispositivo de confianza');
        }
        return { ...response, newDeviceId };
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
exports.Verify2FAUseCase = Verify2FAUseCase;
exports.Verify2FAUseCase = Verify2FAUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        verification_token_repository_1.VerificationTokenRepository,
        trusted_device_repository_1.TrustedDeviceRepository,
        user_repository_1.UserRepository])
], Verify2FAUseCase);
//# sourceMappingURL=verify-2fa.usecase.js.map