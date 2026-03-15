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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/database/prisma/prisma.service");
const user_entity_1 = require("../../domain/user.entity");
const { nanoid } = require('nanoid');
let UserRepository = class UserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findFirst({
            where: { email, is_deleted: false },
            include: { addictions: true },
        });
        if (!user)
            return null;
        return this.toEntity(user);
    }
    async findByEmailIncludeDeleted(email) {
        const user = await this.prisma.user.findFirst({
            where: { email },
            include: { addictions: true },
        });
        if (!user)
            return null;
        return this.toEntity(user);
    }
    async findById(id) {
        const user = await this.prisma.user.findFirst({
            where: { id, is_deleted: false },
            include: { addictions: true },
        });
        if (!user)
            return null;
        return this.toEntity(user);
    }
    async findBySponsorCode(code) {
        const user = await this.prisma.user.findFirst({
            where: { sponsor_code: code, is_deleted: false },
        });
        if (!user)
            return null;
        return this.toEntity(user);
    }
    async create(data) {
        const role = data.role ?? 'ADICTO';
        const sponsorCode = role === 'PADRINO' ? nanoid(8).toUpperCase() : undefined;
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password_hash: data.passwordHash,
                role: role,
                sponsor_code: sponsorCode,
                ...(role === 'ADICTO' && data.addictionName
                    ? {
                        addictions: {
                            create: {
                                custom_name: data.addictionName,
                                classification: data.classification ?? '',
                            },
                        },
                    }
                    : {}),
            },
            include: {
                addictions: true,
            },
        });
        if (role === 'ADICTO' && user.addictions?.[0]) {
            await this.prisma.streak.create({
                data: {
                    user_id: user.id,
                    user_addiction_id: user.addictions[0].id,
                    started_at: new Date(),
                    day_counter: 0,
                    status: 'active',
                },
            });
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                avatar_url: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.id}`,
            },
            include: {
                addictions: true,
            },
        });
        return this.toEntity(updatedUser);
    }
    async softDelete(id) {
        await this.prisma.user.update({
            where: { id },
            data: {
                is_deleted: true,
                deleted_at: new Date(),
            },
        });
    }
    async reactivate(id) {
        await this.prisma.user.update({
            where: { id },
            data: {
                is_deleted: false,
                deleted_at: null,
                is_verified: true,
            },
        });
    }
    toEntity(raw) {
        const entity = new user_entity_1.UserEntity();
        entity.id = raw.id;
        entity.name = raw.name;
        entity.email = raw.email;
        entity.passwordHash = raw.password_hash;
        entity.role = raw.role;
        entity.sponsorCode = raw.sponsor_code ?? null;
        entity.avatarUrl = raw.avatar_url;
        entity.isVerified = raw.is_verified;
        entity.twoFactorEnabled = raw.two_factor_enabled;
        entity.createdAt = raw.created_at;
        entity.updatedAt = raw.updated_at;
        entity.isDeleted = raw.is_deleted;
        entity.addictions = raw.addictions ?? [];
        return entity;
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map