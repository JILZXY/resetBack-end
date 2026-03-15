import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ContactRepository } from '../infrastructure/repositories/contact.repository';
import { NotificationService } from '../infrastructure/services/notification.service';
import { TriggerAlertDto } from '../infrastructure/dtos/trigger-alert.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class TriggerAlertUseCase {
  constructor(
    private readonly contactRepo: ContactRepository,
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, dto: TriggerAlertDto = {}) {
    // 1. Delegar validaciones y creación de alerta a la función de DB
    let alertId: string;
    try {
      const result: any[] = await this.prisma.$queryRaw(
        Prisma.sql`SELECT emergency.fn_trigger_alert(${userId}::uuid) AS alert_id`,
      );
      alertId = result[0].alert_id;
    } catch (error: any) {
      // La función de DB lanza excepciones con mensajes descriptivos
      const msg = error?.message || 'Error al activar la alerta de emergencia';
      if (msg.includes('no tiene contactos')) {
        throw new HttpException(
          {
            code: 'NO_CONTACTS_FOUND',
            message:
              'No tienes contactos de apoyo activos. Agrega al menos uno antes de activar una alerta',
            details: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (msg.includes('no tiene adicci')) {
        throw new HttpException(
          {
            code: 'ADDICTION_NOT_FOUND',
            message: 'El usuario no tiene una adicción activa registrada',
            details: { user_id: userId },
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Si el error no es uno de los mapeados, no exponer el detalle crudo
      throw new HttpException('Error interno al procesar la alerta', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 1.5. Actualizar la alerta con los datos adicionales del DTO si existen
    if (dto.resultedInRelapse !== undefined || dto.resolutionNotes) {
      try {
        await this.prisma.emergencyAlert.update({
          where: { id: alertId },
          data: {
            resulted_in_relapse: dto.resultedInRelapse,
            resolution_notes: dto.resolutionNotes,
          },
        });
      } catch (updateError) {
        // No bloqueamos el flujo principal si falla el guardado de notas
        console.error('Error updating alert notes:', updateError);
      }
    }

    // 2. Enviar notificaciones por correo (responsabilidad del backend)
    const contacts = await this.contactRepo.findAllByUserId(userId);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    try {
      await Promise.all(
        contacts
          .filter((c) => c.email)
          .map((contact) =>
            this.notificationService.sendEmergencyAlert(
              contact.email!,
              user?.name ?? 'Un usuario',
              dto.resolutionNotes,
            ),
          ),
      );
    } catch (notificationError: any) {
      throw new HttpException(
        {
          code: 'NOTIFICATION_FAILURE',
          message:
            'La alerta fue registrada pero hubo un error al enviar las notificaciones',
          details: {
            alertId,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      alertId,
      notifiedContacts: contacts.filter((c) => c.email).length,
    };
  }
}
