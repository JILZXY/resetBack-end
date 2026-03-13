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
exports.SponsorshipRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/database/prisma/prisma.service");
const sponsorship_entity_1 = require("../../domain/sponsorship.entity");
let SponsorshipRepository = class SponsorshipRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRequest(sponsorId, addictId) {
        const sponsorship = await this.prisma.sponsorship.create({
            data: {
                sponsor_id: sponsorId,
                addict_id: addictId,
                status: 'PENDING',
            },
        });
        return this.toEntity(sponsorship);
    }
    async accept(id) {
        const sponsorship = await this.prisma.sponsorship.update({
            where: { id },
            data: {
                status: 'ACTIVE',
                started_at: new Date(),
            },
        });
        return this.toEntity(sponsorship);
    }
    async reject(id) {
        await this.prisma.sponsorship.delete({ where: { id } });
    }
    async setInactive(id, reason) {
        const sponsorship = await this.prisma.sponsorship.update({
            where: { id },
            data: {
                status: 'INACTIVE',
                ended_at: new Date(),
                termination_reason: reason,
            },
        });
        return this.toEntity(sponsorship);
    }
    async findActiveByAddictId(addictId) {
        const sponsorship = await this.prisma.sponsorship.findFirst({
            where: {
                addict_id: addictId,
                status: 'ACTIVE',
            },
        });
        return sponsorship ? this.toEntity(sponsorship) : null;
    }
    async findActiveBySponsorId(sponsorId) {
        const sponsorship = await this.prisma.sponsorship.findFirst({
            where: {
                sponsor_id: sponsorId,
                status: 'ACTIVE',
            },
        });
        return sponsorship ? this.toEntity(sponsorship) : null;
    }
    async findPendingByAddictId(addictId) {
        const sponsorship = await this.prisma.sponsorship.findFirst({
            where: {
                addict_id: addictId,
                status: 'PENDING',
            },
        });
        return sponsorship ? this.toEntity(sponsorship) : null;
    }
    async findPendingBySponsorId(sponsorId) {
        const sponsorship = await this.prisma.sponsorship.findFirst({
            where: {
                sponsor_id: sponsorId,
                status: 'PENDING',
            },
        });
        return sponsorship ? this.toEntity(sponsorship) : null;
    }
    async findById(id) {
        const sponsorship = await this.prisma.sponsorship.findUnique({
            where: { id },
        });
        return sponsorship ? this.toEntity(sponsorship) : null;
    }
    async checkActiveSponsorship(sponsorId, addictId) {
        const count = await this.prisma.sponsorship.count({
            where: {
                sponsor_id: sponsorId,
                addict_id: addictId,
                status: 'ACTIVE',
            },
        });
        return count > 0;
    }
    toEntity(raw) {
        const entity = new sponsorship_entity_1.SponsorshipEntity();
        entity.id = raw.id;
        entity.sponsorId = raw.sponsor_id;
        entity.addictId = raw.addict_id;
        entity.startedAt = raw.started_at;
        entity.endedAt = raw.ended_at;
        entity.status = raw.status;
        entity.terminationReason = raw.termination_reason;
        entity.createdAt = raw.created_at;
        return entity;
    }
};
exports.SponsorshipRepository = SponsorshipRepository;
exports.SponsorshipRepository = SponsorshipRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SponsorshipRepository);
//# sourceMappingURL=sponsorship.repository.js.map