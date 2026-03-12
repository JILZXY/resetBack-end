import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { RequestSponsorshipDto } from '../infrastructure/dtos/request-sponsorship.dto';
import { UserRepository } from '../../auth/infrastructure/repositories/user.repository';
import { NotificationRepository } from '../../forum/infrastructure/repositories/notification.repository';
import { NotificationGateway } from '../../forum/notification.gateway';
import { NotificationService } from '../../emergency/infrastructure/services/notification.service';

@Injectable()
export class RequestSponsorshipUseCase {
  constructor(
    private readonly sponsorshipRepo: SponsorshipRepository,
    private readonly userRepo: UserRepository,
    private readonly notificationRepo: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
    private readonly emailService: NotificationService,
  ) {}

  async execute(userId: string, dto: RequestSponsorshipDto) {
    // 1. Buscar padrino por sponsor_code
    const sponsor = await this.userRepo.findBySponsorCode(dto.sponsor_code);
    if (!sponsor || sponsor.role !== 'PADRINO') {
      throw new HttpException(
        {
          code: 'SPONSOR_NOT_FOUND',
          message: 'Código de padrino no válido o no encontrado',
          details: {},
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // 2. Verificar que el adicto no se auto-apadrine
    if (sponsor.id === userId) {
      throw new HttpException(
        {
          code: 'SELF_SPONSORSHIP',
          message: 'No puedes ser tu propio padrino',
          details: {},
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 3. Verificar que el adicto no tenga ya una relación activa o pendiente
    const existingActive =
      await this.sponsorshipRepo.findActiveByAddictId(userId);
    if (existingActive) {
      throw new HttpException(
        {
          code: 'ALREADY_HAS_SPONSOR',
          message: 'Ya tienes un padrino activo',
          details: {},
        },
        HttpStatus.CONFLICT,
      );
    }

    const existingPending =
      await this.sponsorshipRepo.findPendingByAddictId(userId);
    if (existingPending) {
      throw new HttpException(
        {
          code: 'PENDING_REQUEST_EXISTS',
          message: 'Ya tienes una solicitud de apadrinamiento pendiente',
          details: {},
        },
        HttpStatus.CONFLICT,
      );
    }

    // 4. Crear solicitud con status PENDING
    const sponsorship = await this.sponsorshipRepo.createRequest(
      sponsor.id,
      userId,
    );

    // 5. Notificación al padrino (fire-and-forget)
    this.notifySponsorship(userId, sponsor.id, sponsor.email).catch(() => {});

    return {
      message: 'Solicitud de apadrinamiento enviada exitosamente',
      sponsorship,
    };
  }

  private async notifySponsorship(
    actorId: string,
    sponsorId: string,
    sponsorEmail: string,
  ) {
    // Notificación in-app
    const notification = await this.notificationRepo.create({
      userId: sponsorId,
      actorId,
      type: 'SPONSORSHIP_REQUEST',
      targetId: sponsorId,
    });
    this.notificationGateway.sendToUser(sponsorId, notification);

    // Notificación por email
    const actor = await this.userRepo.findById(actorId);
    await this.emailService.sendEmergencyAlert(
      sponsorEmail,
      actor?.name ?? 'Un usuario',
      'Ha solicitado ser tu ahijado. Entra a la app para revisar la solicitud.',
    );
  }
}
