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
exports.TerminateSponsorshipUseCase = void 0;
const common_1 = require("@nestjs/common");
const sponsorship_repository_1 = require("../infrastructure/repositories/sponsorship.repository");
let TerminateSponsorshipUseCase = class TerminateSponsorshipUseCase {
    sponsorshipRepo;
    constructor(sponsorshipRepo) {
        this.sponsorshipRepo = sponsorshipRepo;
    }
    async execute(userId, sponsorshipId, dto) {
        const sponsorship = await this.sponsorshipRepo.findById(sponsorshipId);
        if (!sponsorship) {
            throw new common_1.HttpException('Relación de apadrinamiento no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        if (sponsorship.status !== 'ACTIVE') {
            throw new common_1.HttpException('La relación no está activa', common_1.HttpStatus.BAD_REQUEST);
        }
        if (sponsorship.sponsorId !== userId && sponsorship.addictId !== userId) {
            throw new common_1.HttpException('No tienes permisos para terminar esta relación', common_1.HttpStatus.FORBIDDEN);
        }
        const reason = dto.reason || 'Terminación voluntaria';
        await this.sponsorshipRepo.setInactive(sponsorshipId, reason);
        return {
            message: 'Relación de apadrinamiento terminada exitosamente',
            sponsorshipId,
        };
    }
};
exports.TerminateSponsorshipUseCase = TerminateSponsorshipUseCase;
exports.TerminateSponsorshipUseCase = TerminateSponsorshipUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sponsorship_repository_1.SponsorshipRepository])
], TerminateSponsorshipUseCase);
//# sourceMappingURL=terminate-sponsorship.usecase.js.map