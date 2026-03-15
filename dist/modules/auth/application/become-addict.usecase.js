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
exports.BecomeAddictUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let BecomeAddictUseCase = class BecomeAddictUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                sponsorships_as_sponsor: {
                    where: { status: 'ACTIVE' },
                },
            },
        });
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role === 'ADICTO') {
            throw new common_1.HttpException('El usuario ya es un adicto', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.prisma.$transaction(async (tx) => {
            for (const sponsorship of user.sponsorships_as_sponsor) {
                await tx.sponsorship.update({
                    where: { id: sponsorship.id },
                    data: {
                        status: 'INACTIVE',
                        ended_at: new Date(),
                        termination_reason: 'El Padrino ha decidido volver a ser un Adicto (Relapso)',
                    },
                });
            }
            const addiction = await tx.userAddiction.upsert({
                where: { user_id: userId },
                update: {
                    custom_name: dto.addictionName,
                    classification: dto.classification ?? '',
                    is_active: true,
                },
                create: {
                    user_id: userId,
                    custom_name: dto.addictionName,
                    classification: dto.classification ?? '',
                    is_active: true,
                },
            });
            await tx.streak.upsert({
                where: { user_id: userId },
                update: {
                    user_addiction_id: addiction.id,
                    started_at: new Date(),
                    day_counter: 0,
                    status: 'active',
                },
                create: {
                    user_id: userId,
                    user_addiction_id: addiction.id,
                    started_at: new Date(),
                    day_counter: 0,
                    status: 'active',
                },
            });
            await tx.user.update({
                where: { id: userId },
                data: {
                    role: 'ADICTO',
                    sponsor_code: null,
                },
            });
        });
        return {
            message: 'Tu rol ha sido cambiado a Adicto. Ánimo, estamos aquí para apoyarte.',
            role: 'ADICTO',
        };
    }
};
exports.BecomeAddictUseCase = BecomeAddictUseCase;
exports.BecomeAddictUseCase = BecomeAddictUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BecomeAddictUseCase);
//# sourceMappingURL=become-addict.usecase.js.map