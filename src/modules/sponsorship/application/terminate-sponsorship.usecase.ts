import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { TerminateSponsorshipDto } from '../infrastructure/dtos/terminate-sponsorship.dto';

@Injectable()
export class TerminateSponsorshipUseCase {
  constructor(private readonly sponsorshipRepo: SponsorshipRepository) {}

  async execute(userId: string, sponsorshipId: string, dto: TerminateSponsorshipDto) {
    const sponsorship = await this.sponsorshipRepo.findById(sponsorshipId);

    if (!sponsorship) {
      throw new HttpException('Relación de apadrinamiento no encontrada', HttpStatus.NOT_FOUND);
    }

    if (!sponsorship.isActive) {
      throw new HttpException('La relación ya estaba terminada', HttpStatus.BAD_REQUEST);
    }

    // El padrino o el ahijado pueden dar por terminada la relación
    if (sponsorship.sponsorId !== userId && sponsorship.addictId !== userId) {
      throw new HttpException('No tienes permisos para terminar esta relación', HttpStatus.FORBIDDEN);
    }

    return await this.sponsorshipRepo.setInactive(sponsorshipId, dto.reason);
  }
}
