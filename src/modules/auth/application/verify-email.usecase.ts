import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { VerificationTokenRepository } from '../infrastructure/repositories/verification-token.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenRepo: VerificationTokenRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(token: string) {
    const tokenRecord = await this.tokenRepo.findByToken(token);

    if (!tokenRecord) {
      throw new HttpException(
        { code: 'INVALID_OR_EXPIRED_TOKEN', message: 'El token de verificación es inválido o ha expirado' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Usamos una transacción para asegurar que el token se elimine al verificar al usuario
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: tokenRecord.user_id },
        data: { is_verified: true },
      }),
      this.prisma.verificationToken.delete({
        where: { id: tokenRecord.id },
      }),
    ]);

    return { message: 'Correo electrónico verificado correctamente. Ya puedes iniciar sesión.' };
  }
}
