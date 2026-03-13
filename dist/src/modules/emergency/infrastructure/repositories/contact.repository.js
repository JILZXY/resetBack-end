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
exports.ContactRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/database/prisma/prisma.service");
const support_contact_entity_1 = require("../../domain/support-contact.entity");
let ContactRepository = class ContactRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async countByUserId(userId) {
        return this.prisma.supportContact.count({
            where: { user_id: userId, is_active: true },
        });
    }
    async findAllByUserId(userId) {
        const contacts = await this.prisma.supportContact.findMany({
            where: { user_id: userId, is_active: true },
            orderBy: { priority_order: 'asc' },
        });
        return contacts.map((c) => this.toEntity(c));
    }
    async findById(id) {
        const contact = await this.prisma.supportContact.findUnique({
            where: { id },
        });
        return contact ? this.toEntity(contact) : null;
    }
    async create(data) {
        const contact = await this.prisma.supportContact.create({
            data: {
                user_id: data.userId,
                contact_name: data.contactName,
                phone: data.phone ?? undefined,
                email: data.email ?? undefined,
                relationship: data.relationship ?? undefined,
                custom_relationship: data.customRelationship ?? undefined,
                priority_order: data.priorityOrder ?? undefined,
            },
        });
        return this.toEntity(contact);
    }
    async deactivate(id) {
        await this.prisma.supportContact.update({
            where: { id },
            data: { is_active: false },
        });
    }
    toEntity(raw) {
        const entity = new support_contact_entity_1.SupportContactEntity();
        entity.id = raw.id;
        entity.userId = raw.user_id;
        entity.contactName = raw.contact_name;
        entity.phone = raw.phone;
        entity.email = raw.email;
        entity.relationship = raw.relationship;
        entity.customRelationship = raw.custom_relationship;
        entity.isActive = raw.is_active;
        entity.priorityOrder = raw.priority_order;
        entity.createdAt = raw.created_at;
        entity.updatedAt = raw.updated_at;
        return entity;
    }
};
exports.ContactRepository = ContactRepository;
exports.ContactRepository = ContactRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactRepository);
//# sourceMappingURL=contact.repository.js.map