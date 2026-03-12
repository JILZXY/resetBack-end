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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../infrastructure/repositories/user.repository");
const verification_token_repository_1 = require("../infrastructure/repositories/verification-token.repository");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let VerifyEmailUseCase = class VerifyEmailUseCase {
    userRepo;
    tokenRepo;
    prisma;
    constructor(userRepo, tokenRepo, prisma) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.prisma = prisma;
    }
    async execute(token) {
        const tokenRecord = await this.tokenRepo.findByToken(token);
        if (!tokenRecord) {
            throw new common_1.HttpException({ code: 'INVALID_OR_EXPIRED_TOKEN', message: 'El token de verificación es inválido o ha expirado' }, common_1.HttpStatus.BAD_REQUEST);
        }
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: tokenRecord.user_id },
                data: { is_verified: true },
            }),
            this.prisma.verificationToken.delete({
                where: { id: tokenRecord.id },
            }),
        ]);
        return { message: 'Correo electrónico verificado correctamente. Ya puedes iniciar sesión.' };
    }
};
exports.VerifyEmailUseCase = VerifyEmailUseCase;
exports.VerifyEmailUseCase = VerifyEmailUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        verification_token_repository_1.VerificationTokenRepository,
        prisma_service_1.PrismaService])
], VerifyEmailUseCase);
//# sourceMappingURL=verify-email.usecase.js.map