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
exports.AddContactUseCase = void 0;
const common_1 = require("@nestjs/common");
const contact_repository_1 = require("../infrastructure/repositories/contact.repository");
let AddContactUseCase = class AddContactUseCase {
    contactRepo;
    constructor(contactRepo) {
        this.contactRepo = contactRepo;
    }
    async execute(userId, dto) {
        const count = await this.contactRepo.countByUserId(userId);
        if (count >= 5) {
            throw new common_1.HttpException({
                code: 'MAX_CONTACTS_REACHED',
                message: 'Ya tienes el máximo de 5 contactos de apoyo registrados',
                details: { current_count: count, max_allowed: 5 },
            }, common_1.HttpStatus.CONFLICT);
        }
        if (!dto.phone && !dto.email) {
            throw new common_1.HttpException({
                code: 'CONTACT_MISSING_REACH',
                message: 'El contacto debe tener al menos un teléfono o correo electrónico',
                details: {},
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.contactRepo.create({
                userId,
                contactName: dto.contactName,
                phone: dto.phone,
                email: dto.email,
                relationship: dto.relationship,
                customRelationship: dto.customRelationship,
                priorityOrder: dto.priorityOrder,
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.HttpException({
                    code: 'DUPLICATE_CONTACT_EMAIL',
                    message: 'Ya tienes un contacto registrado con este correo electrónico',
                    details: { email: dto.email },
                }, common_1.HttpStatus.CONFLICT);
            }
            throw error;
        }
    }
};
exports.AddContactUseCase = AddContactUseCase;
exports.AddContactUseCase = AddContactUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [contact_repository_1.ContactRepository])
], AddContactUseCase);
//# sourceMappingURL=add-contact.usecase.js.map