import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { MailService } from 'src/shared/mail/mail.service';

@Injectable()
export class DeleteAccountUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailService: MailService,
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

    await this.userRepo.softDelete(userId);
    await this.mailService.sendFarewellEmail(user.email, user.name);

    return {
      message: 'Cuenta eliminada correctamente',
    };
  }
}
