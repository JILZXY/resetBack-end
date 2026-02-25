import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AlertRepository } from '../infrastructure/repositories/alert.repository';
import { ContactRepository } from '../infrastructure/repositories/contact.repository';
import { NotificationService } from '../infrastructure/services/notification.service';
import { TriggerAlertDto } from '../infrastructure/dtos/trigger-alert.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class TriggerAlertUseCase {
  constructor(
    private readonly alertRepo: AlertRepository,
    private readonly contactRepo: ContactRepository,
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, dto: TriggerAlertDto) {
    const addiction = await this.prisma.userAddiction.findUnique({
      where: { user_id: userId },
    });

    if (!addiction) {
      throw new HttpException(
        {
          code: 'ADDICTION_NOT_FOUND',
          message: 'El usuario no tiene una adicción registrada',
          details: { user_id: userId },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const contacts = await this.contactRepo.findAllByUserId(userId);

    if (contacts.length === 0) {
      throw new HttpException(
        {
          code: 'NO_CONTACTS_FOUND',
          message: 'No tienes contactos de apoyo registrados. Agrega al menos uno antes de activar una alerta',
          details: {},
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    // Guardar la alerta en DB
    const alert = await this.alertRepo.create({
      userId,
      userAddictionId: addiction.id,
      resultedInRelapse: dto.resulted_in_relapse,
      resolutionNotes: dto.resolution_notes,
    });

    await Promise.all(
      contacts
        .filter((c) => c.email)
        .map((contact) =>
          this.notificationService.sendEmergencyAlert(
            contact.email!,
            user?.name ?? 'Un usuario',
            dto.resolution_notes,
          ),
        ),
    );

    return {
      alertId: alert.id,
      activatedAt: alert.activatedAt,
      notifiedContacts: contacts.length,
    };
  }
}