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
exports.VerificationTokenRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/database/prisma/prisma.service");
let VerificationTokenRepository = class VerificationTokenRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, token, expiresAt) {
        await this.prisma.verificationToken.deleteMany({
            where: { user_id: userId },
        });
        return this.prisma.verificationToken.create({
            data: {
                user_id: userId,
                token,
                expires_at: expiresAt,
            },
        });
    }
    async findByToken(token) {
        return this.prisma.verificationToken.findFirst({
            where: {
                token,
                expires_at: { gt: new Date() },
            },
            include: {
                user: true,
            },
        });
    }
    async delete(id) {
        await this.prisma.verificationToken.delete({
            where: { id },
        });
    }
};
exports.VerificationTokenRepository = VerificationTokenRepository;
exports.VerificationTokenRepository = VerificationTokenRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VerificationTokenRepository);
//# sourceMappingURL=verification-token.repository.js.map