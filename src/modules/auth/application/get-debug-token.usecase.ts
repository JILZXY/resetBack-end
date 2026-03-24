import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { VerificationTokenRepository } from '../infrastructure/repositories/verification-token.repository';

@Injectable()
export class GetDebugTokenUseCase {
  constructor(
    private readonly tokenRepo: VerificationTokenRepository,
  ) {}

  async execute(email: string) {
    if (process.env.NODE_ENV !== 'development') {
      throw new HttpException(
        'Este endpoint solo está disponible en entorno de desarrollo',
        HttpStatus.FORBIDDEN,
      );
    }

    const tokenRecord = await this.tokenRepo.findLatestByUserEmail(email);

    if (!tokenRecord) {
      throw new HttpException(
        { code: 'TOKEN_NOT_FOUND', message: 'No se encontró ningún código activo para este correo' },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      email,
      token: tokenRecord.token,
      type: isNaN(Number(tokenRecord.token)) ? 'email_verification' : '2fa_otp',
      expiresAt: tokenRecord.expires_at,
    };
  }
}
