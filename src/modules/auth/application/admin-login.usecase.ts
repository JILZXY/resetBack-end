import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { LoginDto } from '../infrastructure/dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminLoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto) {
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

    // Validar que el usuario sea ADMIN
    if (user.role !== 'ADMIN') {
      throw new HttpException(
        {
          code: 'FORBIDDEN',
          message: 'No tienes permisos de administrador',
          details: {},
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // Omitimos verificación de email e isVerified por petición del usuario
    // Omitimos 2FA por petición del usuario

    return this.generateTokenResponse(user);
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
      },
    };
  }
}
