import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
const { nanoid } = require('nanoid');

@Injectable()
export class GraduateSponsorUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addictions: true,
      },
    });

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    if (user.role !== 'ADICTO') {
      throw new HttpException(
        'Solo los pacientes pueden graduarse a padrinos',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Buscar apadrinamiento activo donde sea ahijado
    const activeSponsorship = await this.prisma.sponsorship.findFirst({
      where: {
        addict_id: userId,
        status: 'ACTIVE',
      },
    });

    const sponsorCode = nanoid(8).toUpperCase();

    // Iniciar transacción para actualizar todo el estado
    await this.prisma.$transaction(async (tx) => {
      // 1. Terminar apadrinamiento si existe
      if (activeSponsorship) {
        await tx.sponsorship.update({
          where: { id: activeSponsorship.id },
          data: {
            status: 'INACTIVE',
            ended_at: new Date(),
            termination_reason: 'Graduación a Padrino',
          },
        });
      }

      // 2. Desactivar adicciones activas
      const addictions = Array.isArray(user.addictions)
        ? user.addictions
        : user.addictions
          ? [user.addictions]
          : [];
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
        where: { id: userId },
        data: {
          role: 'PADRINO',
          sponsor_code: sponsorCode,
        },
      });
    });

    return {
      message: 'Te has graduado como Padrino exitosamente',
      sponsorCode,
    };
  }
}
