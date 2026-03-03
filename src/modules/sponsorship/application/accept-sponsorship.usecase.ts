import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { NotificationRepository } from '../../forum/infrastructure/repositories/notification.repository';
import { NotificationGateway } from '../../forum/notification.gateway';

@Injectable()
export class AcceptSponsorshipUseCase {
  constructor(
    private readonly sponsorshipRepo: SponsorshipRepository,
    private readonly notificationRepo: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async execute(userId: string) {
    // Buscar solicitud pendiente donde el usuario sea el padrino
    const pending = await this.sponsorshipRepo.findPendingBySponsorId(userId);

    if (!pending) {
      throw new HttpException(
        { code: 'NO_PENDING_REQUEST', message: 'No tienes solicitudes de apadrinamiento pendientes', details: {} },
        HttpStatus.NOT_FOUND,
      );
    }

    // Aceptar la solicitud
    const sponsorship = await this.sponsorshipRepo.accept(pending.id);

    // Notificar al adicto (fire-and-forget)
    this.notifyAddict(userId, pending.addictId).catch(() => {});

    return {
      message: 'Solicitud de apadrinamiento aceptada exitosamente',
      sponsorship,
    };
  }

  private async notifyAddict(sponsorId: string, addictId: string) {
    const notification = await this.notificationRepo.create({
      userId: addictId,
      actorId: sponsorId,
      type: 'SPONSORSHIP_ACCEPTED',
      targetId: addictId,
    });
    this.notificationGateway.sendToUser(addictId, notification);
  }
}
