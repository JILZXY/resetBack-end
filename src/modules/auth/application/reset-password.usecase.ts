import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { PasswordResetTokenRepository } from '../infrastructure/repositories/password-reset-token.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from '../infrastructure/dtos/reset-password.dto';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenRepo: PasswordResetTokenRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: ResetPasswordDto) {
    const tokenRecord = await this.tokenRepo.findByToken(dto.token);

    if (!tokenRecord) {
      throw new HttpException(
        { code: 'INVALID_OR_EXPIRED_TOKEN', message: 'El token es inválido o ha expirado' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    // Usamos una transacción para asegurar que el token se elimine al actualizar la password
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: tokenRecord.user_id },
        data: { password_hash: passwordHash },
      }),
      this.prisma.passwordResetToken.delete({
        where: { id: tokenRecord.id },
      }),
    ]);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
