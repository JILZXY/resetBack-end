import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { ReactivateDto } from '../infrastructure/dtos/reactivate.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ReactivateAccountUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(dto: ReactivateDto) {
    try {
      const user = await this.userRepo.findByEmailIncludeDeleted(dto.email);

      if (!user || !user.isDeleted) {
        throw new HttpException(
          {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado o la cuenta ya está activa',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const isPasswordValid = await bcrypt.compare(
        dto.password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new HttpException(
          {
            code: 'INVALID_CREDENTIALS',
            message: 'Contraseña incorrecta',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.userRepo.reactivate(user.id);

      return {
        message:
          'Cuenta reactivada correctamente. Ahora puedes iniciar sesión.',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Reactivate account error:', error);
      throw new HttpException(
        {
          code: 'INTERNAL_ERROR',
          message: 'Error interno al reactivar la cuenta',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
