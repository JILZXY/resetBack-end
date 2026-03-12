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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const trigger_alert_usecase_1 = require("./application/trigger-alert.usecase");
const add_contact_usecase_1 = require("./application/add-contact.usecase");
const contact_repository_1 = require("./infrastructure/repositories/contact.repository");
const alert_repository_1 = require("./infrastructure/repositories/alert.repository");
const trigger_alert_dto_1 = require("./infrastructure/dtos/trigger-alert.dto");
const create_contact_dto_1 = require("./infrastructure/dtos/create-contact.dto");
let EmergencyController = class EmergencyController {
    triggerAlert;
    addContact;
    contactRepo;
    alertRepo;
    constructor(triggerAlert, addContact, contactRepo, alertRepo) {
        this.triggerAlert = triggerAlert;
        this.addContact = addContact;
        this.contactRepo = contactRepo;
        this.alertRepo = alertRepo;
    }
    createContact(req, dto) {
        return this.addContact.execute(req.user.userId, dto);
    }
    getContacts(req) {
        return this.contactRepo.findAllByUserId(req.user.userId);
    }
    async deleteContact(req, id) {
        const contact = await this.contactRepo.findById(id);
        if (!contact || contact.userId !== req.user.userId) {
            return { message: 'Contacto no encontrado' };
        }
        await this.contactRepo.deactivate(id);
        return { message: 'Contacto eliminado correctamente' };
    }
    triggerEmergency(req, dto) {
        return this.triggerAlert.execute(req.user.userId, dto);
    }
    getAlerts(req) {
        return this.alertRepo.findAllByUserId(req.user.userId);
    }
};
exports.EmergencyController = EmergencyController;
__decorate([
    (0, common_1.Post)('contacts'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_contact_dto_1.CreateContactDto]),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "createContact", null);
__decorate([
    (0, common_1.Get)('contacts'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Delete)('contacts/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "deleteContact", null);
__decorate([
    (0, common_1.Post)('alert'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trigger_alert_dto_1.TriggerAlertDto]),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "triggerEmergency", null);
__decorate([
    (0, common_1.Get)('alerts'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "getAlerts", null);
exports.EmergencyController = EmergencyController = __decorate([
    (0, common_1.Controller)('emergency'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [trigger_alert_usecase_1.TriggerAlertUseCase,
        add_contact_usecase_1.AddContactUseCase,
        contact_repository_1.ContactRepository,
        alert_repository_1.AlertRepository])
], EmergencyController);
//# sourceMappingURL=emergency.controller.js.map