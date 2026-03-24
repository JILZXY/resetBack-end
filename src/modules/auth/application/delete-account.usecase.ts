import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { MailService } from 'src/shared/mail/mail.service';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class DeleteAccountUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new HttpException(
        {
          code: 'USER_NOT_FOUND',
          message: 'Usuario no encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Terminar todas sus relaciones de apadrinamiento (como padrino o como ahijado)
    await this.prisma.sponsorship.updateMany({
      where: {
        OR: [
          { sponsor_id: userId },
          { addict_id: userId }
        ],
        status: { in: ['ACTIVE', 'PENDING'] }
      },
      data: {
        status: 'INACTIVE',
        ended_at: new Date(),
        termination_reason: 'Cuenta del usuario eliminada'
      }
    });

    await this.userRepo.softDelete(userId);
    await this.mailService.sendFarewellEmail(user.email, user.name);

    return {
      message: 'Cuenta eliminada correctamente',
    };
  }
}
