import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class GraduateSponsorUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    // Verificar que el usuario exista y sea patient
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addictions: {
          where: { is_active: true }
        }
      }
    });

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    if (user.role !== 'patient') {
      throw new HttpException('Solo los pacientes pueden graduarse a padrinos', HttpStatus.BAD_REQUEST);
    }

    // Buscar apadrinamiento activo donde sea ahijado
    const activeSponsorship = await this.prisma.sponsorship.findFirst({
      where: {
        addict_id: userId,
        is_active: true
      }
    });

    // Iniciar transacción para actualizar todo el estado (Borrado logico)
    await this.prisma.$transaction(async (tx) => {
      // 1. Terminar apadrinamiento si existe
      if (activeSponsorship) {
        await tx.sponsorship.update({
          where: { id: activeSponsorship.id },
          data: {
            is_active: false,
            ended_at: new Date(),
            termination_reason: 'Graduación a Padrino',
          },
        });
      }

      // 2. Desactivar adicción activa
      if (user.addictions) {
        await tx.userAddiction.update({
          where: { id: user.addictions.id },
          data: { is_active: false },
        });
      }

      // 3. Cambiar el rol a 'sponsor'
      await tx.user.update({
        where: { id: userId },
        data: { role: 'sponsor' },
      });
    });

    return { message: 'Te has graduado como Padrino exitosamente' };
  }
}
