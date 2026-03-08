import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Request,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { LoginUseCase } from './application/login.usecase';
import { RegisterDto } from './infrastructure/dtos/register.dto';
import { LoginDto } from './infrastructure/dtos/login.dto';
import { GetProfileUseCase } from './application/get-profile.usecase';
import { ForgotPasswordUseCase } from './application/forgot-password.usecase';
import { ResetPasswordUseCase } from './application/reset-password.usecase';
import { VerifyEmailUseCase } from './application/verify-email.usecase';
import { ResetPasswordDto } from './infrastructure/dtos/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(
    @Body() dto: LoginDto,
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deviceIdFromCookie = req.cookies['device_id'];
    const result: any = await this.loginUseCase.execute(dto, deviceIdFromCookie);

    if (result.newDeviceId) {
      res.cookie('device_id', result.newDeviceId, {
        httpOnly: true,
        secure: true, // Cambiar a false en desarrollo local sin HTTPS si es necesario
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
      });
      delete result.newDeviceId;
    }

    return result;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return this.getProfileUseCase.execute(req.user.userId);
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.forgotPasswordUseCase.execute(email);
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body('token') token: string) {
    return this.verifyEmailUseCase.execute(token);
  }
}
