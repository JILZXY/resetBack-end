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
      throw new HttpException(
        'El usuario ya es un adicto',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      for (const sponsorship of user.sponsorships_as_sponsor) {
        await tx.sponsorship.update({
          where: { id: sponsorship.id },
          data: {
            status: 'INACTIVE',
            ended_at: new Date(),
            termination_reason:
              'El Padrino ha decidido volver a ser un Adicto (Relapso)',
          },
        });
      }

      const addiction = await tx.userAddiction.upsert({
        where: { user_id: userId },
        update: {
          custom_name: dto.addictionName,
          classification: dto.classification ?? '',
          is_active: true,
        },
        create: {
          user_id: userId,
          custom_name: dto.addictionName,
          classification: dto.classification ?? '',
          is_active: true,
        },
      });

      // 3. Inicializar o resetear su racha
      await tx.streak.upsert({
        where: { user_id: userId }, // Streak tiene @unique en user_id
        update: {
          user_addiction_id: addiction.id,
          started_at: new Date(),
          day_counter: 0,
          status: 'active',
        },
        create: {
          user_id: userId,
          user_addiction_id: addiction.id,
          started_at: new Date(),
          day_counter: 0,
          status: 'active',
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          role: 'ADICTO',
          sponsor_code: null,
        },
      });
    });

    return {
      message:
        'Tu rol ha sido cambiado a Adicto. Ánimo, estamos aquí para apoyarte.',
      role: 'ADICTO',
    };
  }
}
