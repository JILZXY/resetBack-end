import type { Response, Request as ExpressRequest } from 'express';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { LoginUseCase } from './application/login.usecase';
import { RegisterDto } from './infrastructure/dtos/register.dto';
import { LoginDto } from './infrastructure/dtos/login.dto';
import { GetProfileUseCase } from './application/get-profile.usecase';
import { ForgotPasswordUseCase } from './application/forgot-password.usecase';
import { ResetPasswordUseCase } from './application/reset-password.usecase';
import { VerifyEmailUseCase } from './application/verify-email.usecase';
import { DeleteAccountUseCase } from './application/delete-account.usecase';
import { ResetPasswordDto } from './infrastructure/dtos/reset-password.dto';
export declare class AuthController {
    private readonly registerUseCase;
    private readonly loginUseCase;
    private readonly getProfileUseCase;
    private readonly forgotPasswordUseCase;
    private readonly resetPasswordUseCase;
    private readonly verifyEmailUseCase;
    private readonly deleteAccountUseCase;
    constructor(registerUseCase: RegisterUserUseCase, loginUseCase: LoginUseCase, getProfileUseCase: GetProfileUseCase, forgotPasswordUseCase: ForgotPasswordUseCase, resetPasswordUseCase: ResetPasswordUseCase, verifyEmailUseCase: VerifyEmailUseCase, deleteAccountUseCase: DeleteAccountUseCase);
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
    getProfile(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: string | null;
        sponsorCode: string | null;
        avatarUrl: string;
        createdAt: Date;
        addiction: any;
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
}
