"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyModule = void 0;
const common_1 = require("@nestjs/common");
const emergency_controller_1 = require("./emergency.controller");
const contact_repository_1 = require("./infrastructure/repositories/contact.repository");
const alert_repository_1 = require("./infrastructure/repositories/alert.repository");
const notification_service_1 = require("./infrastructure/services/notification.service");
const add_contact_usecase_1 = require("./application/add-contact.usecase");
const trigger_alert_usecase_1 = require("./application/trigger-alert.usecase");
const notify_contacts_usecase_1 = require("./application/notify-contacts.usecase");
let EmergencyModule = class EmergencyModule {
};
exports.EmergencyModule = EmergencyModule;
exports.EmergencyModule = EmergencyModule = __decorate([
    (0, common_1.Module)({
        controllers: [emergency_controller_1.EmergencyController],
        providers: [
            contact_repository_1.ContactRepository,
            alert_repository_1.AlertRepository,
            notification_service_1.NotificationService,
            add_contact_usecase_1.AddContactUseCase,
            trigger_alert_usecase_1.TriggerAlertUseCase,
            notify_contacts_usecase_1.NotifyContactsUseCase,
        ],
        exports: [alert_repository_1.AlertRepository, notification_service_1.NotificationService],
    })
], EmergencyModule);
//# sourceMappingURL=emergency.module.js.map