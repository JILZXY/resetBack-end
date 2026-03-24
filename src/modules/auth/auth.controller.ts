import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Delete,
  UseGuards,
  Request,
  Res,
  Req,
} from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { UpdateProfileUseCase } from './application/update-profile.usecase';
import { LoginUseCase } from './application/login.usecase';
import { Verify2FAUseCase } from './application/verify-2fa.usecase';
import { BecomeAddictUseCase } from './application/become-addict.usecase';
import { AdminLoginUseCase } from './application/admin-login.usecase';
import { RegisterDto } from './infrastructure/dtos/register.dto';
import { LoginDto } from './infrastructure/dtos/login.dto';
import { UpdateProfileDto } from './infrastructure/dtos/update-profile.dto';
import { Verify2FADto } from './infrastructure/dtos/verify-2fa.dto';
import { GetProfileUseCase } from './application/get-profile.usecase';
import { ForgotPasswordUseCase } from './application/forgot-password.usecase';
import { ResetPasswordUseCase } from './application/reset-password.usecase';
import { VerifyEmailUseCase } from './application/verify-email.usecase';
import { DeleteAccountUseCase } from './application/delete-account.usecase';
import { ResetPasswordDto } from './infrastructure/dtos/reset-password.dto';
import { BecomeAddictDto } from './infrastructure/dtos/become-addict.dto';
import { ReactivateDto } from './infrastructure/dtos/reactivate.dto';
import { ReactivateAccountUseCase } from './application/reactivate-account.usecase';
import { GetDebugTokenUseCase } from './application/get-debug-token.usecase';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly verify2FAUseCase: Verify2FAUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
    private readonly becomeAddictUseCase: BecomeAddictUseCase,
    private readonly reactivateAccountUseCase: ReactivateAccountUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly getDebugTokenUseCase: GetDebugTokenUseCase,
    private readonly adminLoginUseCase: AdminLoginUseCase,
  ) { }

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

    this.handleDeviceIdCookie(result, res);

    return result;
  }

  @Post('admin-login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async adminLogin(@Body() dto: LoginDto) {
    return this.adminLoginUseCase.execute(dto);
  }

  @Post('verify-2fa')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async verify2FA(
    @Body() dto: Verify2FADto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: any = await this.verify2FAUseCase.execute(dto);

    this.handleDeviceIdCookie(result, res);

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

  @Delete('account')
  @UseGuards(JwtAuthGuard)
  deleteAccount(@Request() req: any) {
    return this.deleteAccountUseCase.execute(req.user.userId);
  }
  
  @Post('relapse')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  relapse(@Request() req: any, @Body() dto: BecomeAddictDto) {
    return this.becomeAddictUseCase.execute(req.user.userId, dto);
  }

  @Post('profile') // Use PATCH or POST. I will use PATCH. Wait, the route says POST below. I will add PATCH 'profile' here.
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute(req.user.userId, dto);
  }

  @Post('reactivate')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  reactivate(@Body() dto: ReactivateDto) {
    return this.reactivateAccountUseCase.execute(dto);
  }

  @Get('debug/last-token/:email')
  getDebugToken(@Request() req: any) {
    return this.getDebugTokenUseCase.execute(req.params.email);
  }

  private handleDeviceIdCookie(result: any, res: Response) {
    if (result && result.newDeviceId) {
      res.cookie('device_id', result.newDeviceId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        partitioned: true, // Importante para CHIPS (cookies cross-site modernas)
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
      });
      delete result.newDeviceId;
    }
  }
}
