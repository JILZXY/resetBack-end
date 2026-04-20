import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { VerificationTokenRepository } from '../infrastructure/repositories/verification-token.repository';
import { TrustedDeviceRepository } from '../infrastructure/repositories/trusted-device.repository';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { Verify2FADto } from '../infrastructure/dtos/verify-2fa.dto';
import * as crypto from 'crypto';

@Injectable()
export class Verify2FAUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepo: VerificationTokenRepository,
    private readonly trustedDeviceRepo: TrustedDeviceRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(dto: Verify2FADto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.mfaToken);
    } catch (e) {
      throw new HttpException(
        {
          code: 'INVALID_MFA_TOKEN',
          message: 'El token de desafío ha expirado o es inválido',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (payload.type !== 'mfa_challenge') {
      throw new HttpException(
        { code: 'INVALID_MFA_TOKEN', message: 'Token de desafío inválido' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userId = payload.sub;
    const tokenRecord = await this.tokenRepo.findByToken(dto.code);

    if (!tokenRecord || tokenRecord.user_id !== userId) {
      throw new HttpException(
        {
          code: 'INVALID_OTP_CODE',
          message: 'El código ingresado es incorrecto o ha expirado',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    await this.tokenRepo.delete(tokenRecord.id);

    const response = this.generateTokenResponse(user);

    let newDeviceId: string | undefined;
    if (payload.rememberMe || dto.rememberMe) {
      newDeviceId = crypto.randomBytes(32).toString('hex');
      await this.trustedDeviceRepo.create(
        user.id,
        newDeviceId,
        'Dispositivo de confianza',
      );
    }

    return { ...response, newDeviceId };
  }

  private generateTokenResponse(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        sponsorCode: user.sponsorCode,
      },
    };
  }
}
