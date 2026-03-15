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
exports.GetProfileUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../infrastructure/repositories/user.repository");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let GetProfileUseCase = class GetProfileUseCase {
    userRepo;
    prisma;
    constructor(userRepo, prisma) {
        this.userRepo = userRepo;
        this.prisma = prisma;
    }
    async execute(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        let sponsor = null;
        if (user.role === 'ADICTO') {
            const sponsorship = await this.prisma.sponsorship.findFirst({
                where: {
                    addict_id: userId,
                    status: { in: ['ACTIVE', 'PENDING'] },
                    sponsor: {
                        is_deleted: false,
                    },
                },
                include: {
                    sponsor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar_url: true,
                        },
                    },
                },
            });
            if (sponsorship?.sponsor) {
                sponsor = {
                    id: sponsorship.sponsor.id,
                    name: sponsorship.sponsor.name,
                    email: sponsorship.sponsor.email,
                    avatarUrl: sponsorship.sponsor.avatar_url,
                    sponsorshipId: sponsorship.id,
                    status: sponsorship.status,
                };
            }
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            sponsorCode: user.sponsorCode,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            addiction: user.addictions?.[0] ?? null,
            sponsor,
        };
    }
};
exports.GetProfileUseCase = GetProfileUseCase;
exports.GetProfileUseCase = GetProfileUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        prisma_service_1.PrismaService])
], GetProfileUseCase);
//# sourceMappingURL=get-profile.usecase.js.map