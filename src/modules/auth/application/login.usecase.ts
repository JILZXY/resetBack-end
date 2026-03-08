import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { TrustedDeviceRepository } from '../infrastructure/repositories/trusted-device.repository';
import { LoginDto } from '../infrastructure/dtos/login.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly trustedDeviceRepo: TrustedDeviceRepository,
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
          message: 'Debes verificar tu correo electrónico antes de iniciar sesión',
          details: { email: user.email },
        },
        HttpStatus.FORBIDDEN,
      );
    }
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

    // LÓGICA DE 2FA / TRUSTED DEVICE
    if (deviceIdFromCookie) {
      const isTrusted = await this.trustedDeviceRepo.findValidDevice(user.id, deviceIdFromCookie);
      if (isTrusted) {
        await this.trustedDeviceRepo.updateLastUsed(isTrusted.id);
        return this.generateTokenResponse(user);
      }
    }

    // Por ahora, permitimos el login pero marcamos que el 2FA podría ser necesario
    // En una implementación completa, aquí lanzaríamos un error indicando 2FA_REQUIRED
    const response = this.generateTokenResponse(user);

    // Si pidió recordar y NO tenía un dispositivo válido, generamos uno nuevo
    if (dto.rememberMe) {
        const newDeviceId = crypto.randomBytes(32).toString('hex');
        await this.trustedDeviceRepo.create(user.id, newDeviceId, 'Dispositivo de confianza');
        return { ...response, newDeviceId };
    }

    return response;
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
