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
exports.GetDebugTokenUseCase = void 0;
const common_1 = require("@nestjs/common");
const verification_token_repository_1 = require("../infrastructure/repositories/verification-token.repository");
let GetDebugTokenUseCase = class GetDebugTokenUseCase {
    tokenRepo;
    constructor(tokenRepo) {
        this.tokenRepo = tokenRepo;
    }
    async execute(email) {
        if (process.env.NODE_ENV !== 'development') {
            throw new common_1.HttpException('Este endpoint solo está disponible en entorno de desarrollo', common_1.HttpStatus.FORBIDDEN);
        }
        const tokenRecord = await this.tokenRepo.findLatestByUserEmail(email);
        if (!tokenRecord) {
            throw new common_1.HttpException({ code: 'TOKEN_NOT_FOUND', message: 'No se encontró ningún código activo para este correo' }, common_1.HttpStatus.NOT_FOUND);
        }
        return {
            email,
            token: tokenRecord.token,
            type: isNaN(Number(tokenRecord.token)) ? 'email_verification' : '2fa_otp',
            expiresAt: tokenRecord.expires_at,
        };
    }
};
exports.GetDebugTokenUseCase = GetDebugTokenUseCase;
exports.GetDebugTokenUseCase = GetDebugTokenUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [verification_token_repository_1.VerificationTokenRepository])
], GetDebugTokenUseCase);
//# sourceMappingURL=get-debug-token.usecase.js.map