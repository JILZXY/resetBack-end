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
exports.ResetPasswordUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../infrastructure/repositories/user.repository");
const password_reset_token_repository_1 = require("../infrastructure/repositories/password-reset-token.repository");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let ResetPasswordUseCase = class ResetPasswordUseCase {
    userRepo;
    tokenRepo;
    prisma;
    constructor(userRepo, tokenRepo, prisma) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.prisma = prisma;
    }
    async execute(dto) {
        const tokenRecord = await this.tokenRepo.findByToken(dto.token);
        if (!tokenRecord) {
            throw new common_1.HttpException({ code: 'INVALID_OR_EXPIRED_TOKEN', message: 'El token es inválido o ha expirado' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: tokenRecord.user_id },
                data: { password_hash: passwordHash },
            }),
            this.prisma.passwordResetToken.delete({
                where: { id: tokenRecord.id },
            }),
        ]);
        return { message: 'Contraseña actualizada correctamente' };
    }
};
exports.ResetPasswordUseCase = ResetPasswordUseCase;
exports.ResetPasswordUseCase = ResetPasswordUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        password_reset_token_repository_1.PasswordResetTokenRepository,
        prisma_service_1.PrismaService])
], ResetPasswordUseCase);
//# sourceMappingURL=reset-password.usecase.js.map