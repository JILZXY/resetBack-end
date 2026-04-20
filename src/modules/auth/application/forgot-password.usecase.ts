import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { PasswordResetTokenRepository } from '../infrastructure/repositories/password-reset-token.repository';
import { MailService } from 'src/shared/mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenRepo: PasswordResetTokenRepository,
    private readonly mailService: MailService,
  ) {}

  async execute(email: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      return {
        message:
          'Si el correo está registrado, recibirás un enlace de recuperación',
      };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.tokenRepo.create(user.id, token, expiresAt);
    await this.mailService.sendPasswordReset(user.email, token);

    return {
      message:
        'Si el correo está registrado, recibirás un enlace de recuperación',
    };
  }
}
