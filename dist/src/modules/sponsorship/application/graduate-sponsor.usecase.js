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
exports.GraduateSponsorUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
const { nanoid } = require('nanoid');
let GraduateSponsorUseCase = class GraduateSponsorUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                addictions: true
            }
        });
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role !== 'ADICTO') {
            throw new common_1.HttpException('Solo los pacientes pueden graduarse a padrinos', common_1.HttpStatus.BAD_REQUEST);
        }
        const activeSponsorship = await this.prisma.sponsorship.findFirst({
            where: {
                addict_id: userId,
                status: 'ACTIVE'
            }
        });
        const sponsorCode = nanoid(8).toUpperCase();
        await this.prisma.$transaction(async (tx) => {
            if (activeSponsorship) {
                await tx.sponsorship.update({
                    where: { id: activeSponsorship.id },
                    data: {
                        status: 'INACTIVE',
                        ended_at: new Date(),
                        termination_reason: 'Graduación a Padrino',
                    },
                });
            }
            const addictions = Array.isArray(user.addictions) ? user.addictions : (user.addictions ? [user.addictions] : []);
            for (const addiction of addictions) {
                if (addiction.is_active) {
                    await tx.userAddiction.update({
                        where: { id: addiction.id },
                        data: { is_active: false },
                    });
                }
            }
            await tx.user.update({
                where: { id: userId },
                data: {
                    role: 'PADRINO',
                    sponsor_code: sponsorCode,
                },
            });
        });
        return {
            message: 'Te has graduado como Padrino exitosamente',
            sponsorCode,
        };
    }
};
exports.GraduateSponsorUseCase = GraduateSponsorUseCase;
exports.GraduateSponsorUseCase = GraduateSponsorUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GraduateSponsorUseCase);
//# sourceMappingURL=graduate-sponsor.usecase.js.map