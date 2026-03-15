import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { BecomeAddictDto } from '../infrastructure/dtos/become-addict.dto';

@Injectable()
export class BecomeAddictUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: BecomeAddictDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sponsorships_as_sponsor: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    if (user.role === 'ADICTO') {
      throw new HttpException('El usuario ya es un adicto', HttpStatus.BAD_REQUEST);
    }

    // Iniciar transacción para el cambio de rol
    await this.prisma.$transaction(async (tx) => {
      // 1. Terminar todas sus relaciones activas donde es padrino
      for (const sponsorship of user.sponsorships_as_sponsor) {
        await tx.sponsorship.update({
          where: { id: sponsorship.id },
          data: {
            status: 'INACTIVE',
            ended_at: new Date(),
            termination_reason: 'El Padrino ha decidido volver a ser un Adicto (Relapso)',
          },
        });
      }

      // 2. Crear su registro de adicción
      const addiction = await tx.userAddiction.create({
        data: {
          user_id: userId,
          custom_name: dto.addictionName,
          classification: dto.classification ?? '',
          is_active: true,
        },
      });

      // 3. Inicializar su streak
      await tx.streak.create({
        data: {
          user_id: userId,
          user_addiction_id: addiction.id,
          started_at: new Date(),
          day_counter: 0,
          status: 'active',
        },
      });

      // 4. Cambiar rol a ADICTO y eliminar sponsor_code
      await tx.user.update({
        where: { id: userId },
        data: {
          role: 'ADICTO',
          sponsor_code: null,
        },
      });
    });

    return {
      message: 'Tu rol ha sido cambiado a Adicto. Ánimo, estamos aquí para apoyarte.',
      role: 'ADICTO',
    };
  }
}
