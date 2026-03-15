import type { Response, Request as ExpressRequest } from 'express';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { LoginUseCase } from './application/login.usecase';
import { Verify2FAUseCase } from './application/verify-2fa.usecase';
import { BecomeAddictUseCase } from './application/become-addict.usecase';
import { RegisterDto } from './infrastructure/dtos/register.dto';
import { LoginDto } from './infrastructure/dtos/login.dto';
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
export declare class AuthController {
    private readonly registerUseCase;
    private readonly loginUseCase;
    private readonly verify2FAUseCase;
    private readonly getProfileUseCase;
    private readonly forgotPasswordUseCase;
    private readonly resetPasswordUseCase;
    private readonly verifyEmailUseCase;
    private readonly deleteAccountUseCase;
    private readonly becomeAddictUseCase;
    private readonly reactivateAccountUseCase;
    constructor(registerUseCase: RegisterUserUseCase, loginUseCase: LoginUseCase, verify2FAUseCase: Verify2FAUseCase, getProfileUseCase: GetProfileUseCase, forgotPasswordUseCase: ForgotPasswordUseCase, resetPasswordUseCase: ResetPasswordUseCase, verifyEmailUseCase: VerifyEmailUseCase, deleteAccountUseCase: DeleteAccountUseCase, becomeAddictUseCase: BecomeAddictUseCase, reactivateAccountUseCase: ReactivateAccountUseCase);
    register(dto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: string | null;
        sponsorCode: string | null;
        avatarUrl: string;
        createdAt: Date;
    }>;
    login(dto: LoginDto, req: ExpressRequest, res: Response): Promise<any>;
    verify2FA(dto: Verify2FADto, res: Response): Promise<any>;
    getProfile(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: string | null;
        sponsorCode: string | null;
        avatarUrl: string;
        createdAt: Date;
        addiction: any;
        sponsor: any;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    deleteAccount(req: any): Promise<{
        message: string;
    }>;
    relapse(req: any, dto: BecomeAddictDto): Promise<{
        message: string;
        role: string;
    }>;
    reactivate(dto: ReactivateDto): Promise<{
        message: string;
    }>;
    private handleDeviceIdCookie;
}
