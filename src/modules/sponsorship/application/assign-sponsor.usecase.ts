import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { AssignSponsorDto } from '../infrastructure/dtos/assign-sponsor.dto';
import { UserRepository } from '../../auth/infrastructure/repositories/user.repository';

@Injectable()
export class AssignSponsorUseCase {
  constructor(
    private readonly sponsorshipRepo: SponsorshipRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(dto: AssignSponsorDto) {
    if (dto.sponsorId === dto.addictId) {
      throw new HttpException(
        'Un usuario no puede ser sponsor de sí mismo',
        HttpStatus.BAD_REQUEST,
      );
    }

    const sponsor = await this.userRepo.findById(dto.sponsorId);
    const addict = await this.userRepo.findById(dto.addictId);

    if (!sponsor || sponsor.role !== 'sponsor') {
      throw new HttpException('Padrino no encontrado o inválido', HttpStatus.NOT_FOUND);
    }
    if (!addict || addict.role !== 'patient') {
      throw new HttpException('Ahijado no encontrado o inválido', HttpStatus.NOT_FOUND);
    }

    const addictActiveSponsorship = await this.sponsorshipRepo.findActiveByAddictId(dto.addictId);
    if (addictActiveSponsorship) {
      throw new HttpException('El ahijado ya tiene un padrino activo', HttpStatus.CONFLICT);
    }

    const sponsorActiveSponsorship = await this.sponsorshipRepo.findActiveBySponsorId(dto.sponsorId);
    if (sponsorActiveSponsorship) {
      throw new HttpException('El padrino ya tiene un ahijado activo', HttpStatus.CONFLICT);
    }

    return await this.sponsorshipRepo.create(dto.sponsorId, dto.addictId);
  }
}
