import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { TerminateSponsorshipDto } from '../infrastructure/dtos/terminate-sponsorship.dto';

@Injectable()
export class TerminateSponsorshipUseCase {
  constructor(private readonly sponsorshipRepo: SponsorshipRepository) {}

  async execute(
    userId: string,
    sponsorshipId: string,
    dto: TerminateSponsorshipDto,
  ) {
    const sponsorship = await this.sponsorshipRepo.findById(sponsorshipId);

    if (!sponsorship) {
      throw new HttpException(
        'Relación de apadrinamiento no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (sponsorship.status !== 'ACTIVE') {
      throw new HttpException(
        'La relación no está activa',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Solo el ahijado puede dar por terminada la relación de apadrinamiento libremente
    if (sponsorship.addictId !== userId) {
      throw new HttpException(
        'Solo el ahijado puede terminar esta relación de apadrinamiento',
        HttpStatus.FORBIDDEN,
      );
    }

    const reason = dto.reason || 'Terminación voluntaria';
    await this.sponsorshipRepo.setInactive(sponsorshipId, reason);

    return {
      message: 'Relación de apadrinamiento terminada exitosamente',
      sponsorshipId,
    };
  }
}
