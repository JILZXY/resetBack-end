import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Error interno del servidor';
    let details: Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        code = (resp.code as string) ?? this.statusToCode(status);
        message = (resp.message as string) ?? (resp.error as string) ?? message;
        details = (resp.details as Record<string, unknown>) ?? {};
      }

      if (code === 'INTERNAL_SERVER_ERROR') {
        code = this.statusToCode(status);
      }
    } else if (exception instanceof Error) {
    }

    if (process.env.NODE_ENV === 'development') {
      details = {
        ...details,
        rawMessage: (exception as any)?.message,
        stack: (exception as any)?.stack,
      };
    }

    console.error(`[${request.method}] ${request.url} → ${status}`, exception);

    response.status(status).json({
      code,
      message,
      details,
    });
  }

  private statusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      500: 'INTERNAL_SERVER_ERROR',
    };
    return map[status] ?? 'UNKNOWN_ERROR';
  }
}
