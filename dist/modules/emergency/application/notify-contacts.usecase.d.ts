import { ContactRepository } from '../infrastructure/repositories/contact.repository';
import { NotificationService } from '../infrastructure/services/notification.service';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class NotifyContactsUseCase {
    private readonly contactRepo;
    private readonly notificationService;
    private readonly prisma;
    constructor(contactRepo: ContactRepository, notificationService: NotificationService, prisma: PrismaService);
    execute(userId: string): Promise<void>;
}
