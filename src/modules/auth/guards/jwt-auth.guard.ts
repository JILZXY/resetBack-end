import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new HttpException(
        {
          code: 'TOKEN_INVALID_OR_EXPIRED',
          message: 'Token inválido o expirado. Por favor inicia sesión nuevamente',
          details: { reason: info?.message ?? 'unauthorized' },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}