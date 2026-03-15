import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
const { nanoid } = require('nanoid');

@Injectable()
export class GraduateSponsorUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(sponsorId: string, addictId: string) {
    const addict = await this.prisma.user.findUnique({
      where: { id: addictId },
      include: {
        addictions: true,
      },
    });

    if (!addict) {
      throw new HttpException('Adicto no encontrado', HttpStatus.NOT_FOUND);
    }
    if (addict.role !== 'ADICTO') {
      throw new HttpException(
        'Solo los adictos pueden graduarse a padrinos',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verificar que el sponsorId sea efectivamente su padrino activo
    const activeSponsorship = await this.prisma.sponsorship.findFirst({
      where: {
        addict_id: addictId,
        sponsor_id: sponsorId,
        status: 'ACTIVE',
      },
    });

    if (!activeSponsorship) {
      throw new HttpException(
        'No tienes permiso para graduar a este usuario. Debe ser tu ahijado activo.',
        HttpStatus.FORBIDDEN,
      );
    }

    const sponsorCode = nanoid(8).toUpperCase();

    // Iniciar transacción para actualizar todo el estado
    await this.prisma.$transaction(async (tx) => {
      // 1. Terminar apadrinamiento
      await tx.sponsorship.update({
        where: { id: activeSponsorship.id },
        data: {
          status: 'INACTIVE',
          ended_at: new Date(),
          termination_reason: 'Graduación a Padrino (Otorgada por el Padrino)',
        },
      });

      // 2. Desactivar adicciones activas
      const addictions = addict.addictions ?? [];
      for (const addiction of addictions) {
        if (addiction.is_active) {
          await tx.userAddiction.update({
            where: { id: addiction.id },
            data: { is_active: false },
          });
        }
      }

      // 3. Cambiar el rol a PADRINO y asignar sponsor_code
      await tx.user.update({
        where: { id: addictId },
        data: {
          role: 'PADRINO',
          sponsor_code: sponsorCode,
        },
      });
    });

    return {
      message: '¡Felicidades! Tu ahijado se ha graduado como Padrino exitosamente',
      addictName: addict.name,
      sponsorCode,
    };
  }
}
