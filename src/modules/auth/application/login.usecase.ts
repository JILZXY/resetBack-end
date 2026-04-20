import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { TrustedDeviceRepository } from '../infrastructure/repositories/trusted-device.repository';
import { VerificationTokenRepository } from '../infrastructure/repositories/verification-token.repository';
import { MailService } from 'src/shared/mail/mail.service';
import { LoginDto } from '../infrastructure/dtos/login.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly trustedDeviceRepo: TrustedDeviceRepository,
    private readonly tokenRepo: VerificationTokenRepository,
    private readonly mailService: MailService,
  ) {}

  async execute(dto: LoginDto, deviceIdFromCookie?: string) {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) {
      throw new HttpException(
        {
          code: 'INVALID_CREDENTIALS',
          message: 'Correo o contraseña incorrectos',
          details: {},
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatch) {
      throw new HttpException(
        {
          code: 'INVALID_CREDENTIALS',
          message: 'Correo o contraseña incorrectos',
          details: {},
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.isVerified) {
      throw new HttpException(
        {
          code: 'EMAIL_NOT_VERIFIED',
          message:
            'Debes verificar tu correo electrónico antes de iniciar sesión',
          details: { email: user.email },
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (deviceIdFromCookie) {
      const isTrusted = await this.trustedDeviceRepo.findValidDevice(
        user.id,
        deviceIdFromCookie,
      );
      if (isTrusted) {
        await this.trustedDeviceRepo.updateLastUsed(isTrusted.id);
        return this.generateTokenResponse(user);
      }
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.tokenRepo.create(user.id, otpCode, expiresAt);
    await this.mailService.send2FACode(user.email, otpCode);

    const mfaToken = this.jwtService.sign(
      {
        sub: user.id,
        type: 'mfa_challenge',
        rememberMe: dto.rememberMe,
      },
      { expiresIn: '15m' },
    );

    return {
      code: '2FA_REQUIRED',
      message: 'Se ha enviado un código de seguridad a tu correo electrónico',
      mfaToken,
    };
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
