import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { NotificationRepository } from '../../forum/infrastructure/repositories/notification.repository';
import { NotificationGateway } from '../../forum/notification.gateway';
import { UserRepository } from '../../auth/infrastructure/repositories/user.repository';

@Injectable()
export class RejectSponsorshipUseCase {
  constructor(
    private readonly sponsorshipRepo: SponsorshipRepository,
    private readonly notificationRepo: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string) {
    // Buscar solicitud pendiente donde el usuario sea el padrino
    const pending = await this.sponsorshipRepo.findPendingBySponsorId(userId);

    if (!pending) {
      throw new HttpException(
        {
          code: 'NO_PENDING_REQUEST',
          message: 'No tienes solicitudes de apadrinamiento pendientes',
          details: {},
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Eliminar el registro para liberar constraints @unique
    await this.sponsorshipRepo.reject(pending.id);

    // Limpiar notificación de solicitud para el padrino
    await this.notificationRepo.markAsReadByCriteria({
      userId: userId,
      actorId: pending.addictId,
      type: 'SPONSORSHIP_REQUEST',
    });

    // Notificar al adicto (fire-and-forget)
    this.notifyAddict(userId, pending.addictId).catch(() => {});

    return { message: 'Solicitud de apadrinamiento rechazada' };
  }

  private async notifyAddict(sponsorId: string, addictId: string) {
    const actor = await this.userRepo.findById(sponsorId);

    const notification = await this.notificationRepo.create({
      userId: addictId,
      actorId: sponsorId,
      actorName: actor?.name,
      actorAvatarUrl: actor?.avatarUrl,
      type: 'SPONSORSHIP_REJECTED',
      targetId: addictId,
    });
    this.notificationGateway.sendToUser(addictId, notification);
  }
}
