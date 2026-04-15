import { Injectable } from '@nestjs/common';
import { ContactRepository } from '../infrastructure/repositories/contact.repository';
import { NotificationService } from '../infrastructure/services/notification.service';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class NotifyContactsUseCase {
  constructor(
    private readonly contactRepo: ContactRepository,
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const contacts = await this.contactRepo.findAllByUserId(userId);
    await Promise.all(
      contacts
        .filter((c) => c.email)
        .map((contact) =>
          this.notificationService.sendEmergencyAlert(
            contact.email!,
            user?.name ?? 'Un usuario',
          ),
        ),
    );
  }
}
