import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { JwtStrategy } from './auth.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { LoginUseCase } from './application/login.usecase';
import { GetProfileUseCase } from './application/get-profile.usecase';
import { ForgotPasswordUseCase } from './application/forgot-password.usecase';
import { ResetPasswordUseCase } from './application/reset-password.usecase';
import { VerifyEmailUseCase } from './application/verify-email.usecase';
import { DeleteAccountUseCase } from './application/delete-account.usecase';
import { BecomeAddictUseCase } from './application/become-addict.usecase';
import { Verify2FAUseCase } from './application/verify-2fa.usecase';
import { ReactivateAccountUseCase } from './application/reactivate-account.usecase';
import { PasswordResetTokenRepository } from './infrastructure/repositories/password-reset-token.repository';
import { VerificationTokenRepository } from './infrastructure/repositories/verification-token.repository';
import { TrustedDeviceRepository } from './infrastructure/repositories/trusted-device.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? '',
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '7d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    UserRepository,
    RegisterUserUseCase,
    LoginUseCase,
    GetProfileUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    VerifyEmailUseCase,
    DeleteAccountUseCase,
    Verify2FAUseCase,
    BecomeAddictUseCase,
    ReactivateAccountUseCase,
    PasswordResetTokenRepository,
    VerificationTokenRepository,
    TrustedDeviceRepository,
  ],
  exports: [JwtModule, UserRepository],
})
export class AuthModule {}
