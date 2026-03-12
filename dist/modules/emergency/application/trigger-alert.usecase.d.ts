import { ContactRepository } from '../infrastructure/repositories/contact.repository';
import { NotificationService } from '../infrastructure/services/notification.service';
import { TriggerAlertDto } from '../infrastructure/dtos/trigger-alert.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class TriggerAlertUseCase {
    private readonly contactRepo;
    private readonly notificationService;
    private readonly prisma;
    constructor(contactRepo: ContactRepository, notificationService: NotificationService, prisma: PrismaService);
    execute(userId: string, dto: TriggerAlertDto): Promise<{
        alertId: string;
        notifiedContacts: number;
    }>;
}
