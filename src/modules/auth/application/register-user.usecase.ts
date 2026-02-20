import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { RegisterDto } from '../infrastructure/dtos/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(dto: RegisterDto) {
    const existing = await this.userRepo.findByEmail(dto.email);

    if (existing) {
      throw new HttpException(
        {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Ya existe una cuenta con este correo electrónico',
          details: { email: dto.email },
        },
        HttpStatus.CONFLICT,
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}