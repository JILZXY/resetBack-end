import { TriggerAlertUseCase } from './application/trigger-alert.usecase';
import { AddContactUseCase } from './application/add-contact.usecase';
import { ContactRepository } from './infrastructure/repositories/contact.repository';
import { AlertRepository } from './infrastructure/repositories/alert.repository';
import { TriggerAlertDto } from './infrastructure/dtos/trigger-alert.dto';
import { CreateContactDto } from './infrastructure/dtos/create-contact.dto';
export declare class EmergencyController {
    private readonly triggerAlert;
    private readonly addContact;
    private readonly contactRepo;
    private readonly alertRepo;
    constructor(triggerAlert: TriggerAlertUseCase, addContact: AddContactUseCase, contactRepo: ContactRepository, alertRepo: AlertRepository);
    createContact(req: any, dto: CreateContactDto): Promise<import("./domain/support-contact.entity").SupportContactEntity>;
    getContacts(req: any): Promise<import("./domain/support-contact.entity").SupportContactEntity[]>;
    deleteContact(req: any, id: string): Promise<{
        message: string;
    }>;
    triggerEmergency(req: any, dto: TriggerAlertDto): Promise<{
        alertId: string;
        notifiedContacts: number;
    }>;
    getAlerts(req: any): Promise<import("./domain/emergency-alert.entity").EmergencyAlertEntity[]>;
}
