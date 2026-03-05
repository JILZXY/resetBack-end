import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { TerminateSponsorshipDto } from '../infrastructure/dtos/terminate-sponsorship.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class TerminateSponsorshipUseCase {
  constructor(
    private readonly sponsorshipRepo: SponsorshipRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, sponsorshipId: string, dto: TerminateSponsorshipDto) {
    // Validar que el sponsorship existe y que el usuario tiene permisos
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

    // Delegar la terminación a la función de DB usando el sponsor_id
    const reason = dto.reason || 'Terminación voluntaria';
    const result: any[] = await this.prisma.$queryRaw(
      Prisma.sql`SELECT core.fn_close_sponsorship(${sponsorship.sponsorId}::uuid, ${reason}) AS success`,
    );

    const success = result[0]?.success ?? false;

    if (!success) {
      throw new HttpException('No se pudo terminar la relación de apadrinamiento', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      message: 'Relación de apadrinamiento terminada exitosamente',
      sponsorshipId,
    };
  }
}
