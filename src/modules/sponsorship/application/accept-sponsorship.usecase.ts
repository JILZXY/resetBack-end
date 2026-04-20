import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { NotificationRepository } from '../../forum/infrastructure/repositories/notification.repository';
import { NotificationGateway } from '../../forum/notification.gateway';
import { UserRepository } from '../../auth/infrastructure/repositories/user.repository';

@Injectable()
export class AcceptSponsorshipUseCase {
  constructor(
    private readonly sponsorshipRepo: SponsorshipRepository,
    private readonly notificationRepo: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string) {
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

    const sponsorship = await this.sponsorshipRepo.accept(pending.id);

    await this.notificationRepo.markAsReadByCriteria({
      userId: userId,
      actorId: pending.addictId,
      type: 'SPONSORSHIP_REQUEST',
    });

    this.notifyAddict(userId, pending.addictId).catch(() => {});

    return {
      message: 'Solicitud de apadrinamiento aceptada exitosamente',
      sponsorship,
    };
  }

  private async notifyAddict(sponsorId: string, addictId: string) {
    const actor = await this.userRepo.findById(sponsorId);

    const notification = await this.notificationRepo.create({
      userId: addictId,
      actorId: sponsorId,
      actorName: actor?.name,
      actorAvatarUrl: actor?.avatarUrl,
      type: 'SPONSORSHIP_ACCEPTED',
      targetId: addictId,
    });
    this.notificationGateway.sendToUser(addictId, notification);
  }
}
