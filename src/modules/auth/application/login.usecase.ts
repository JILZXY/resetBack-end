import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { LoginDto } from '../infrastructure/dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
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