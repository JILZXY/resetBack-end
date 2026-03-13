import { AddContactUseCase } from './application/add-contact.usecase';
import { TriggerAlertUseCase } from './application/trigger-alert.usecase';
import { ContactRepository } from './infrastructure/repositories/contact.repository';
import { AlertRepository } from './infrastructure/repositories/alert.repository';
import { CreateContactDto } from './infrastructure/dtos/create-contact.dto';
import { TriggerAlertDto } from './infrastructure/dtos/trigger-alert.dto';
export declare class EmergencyController {
    private readonly addContact;
    private readonly triggerAlert;
    private readonly contactRepo;
    private readonly alertRepo;
    constructor(addContact: AddContactUseCase, triggerAlert: TriggerAlertUseCase, contactRepo: ContactRepository, alertRepo: AlertRepository);
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
