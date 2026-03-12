import { RegisterUserUseCase } from './application/register-user.usecase';
import { LoginUseCase } from './application/login.usecase';
import { RegisterDto } from './infrastructure/dtos/register.dto';
import { LoginDto } from './infrastructure/dtos/login.dto';
export declare class AuthController {
    private readonly registerUseCase;
    private readonly loginUseCase;
    constructor(registerUseCase: RegisterUserUseCase, loginUseCase: LoginUseCase);
    register(dto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: string | null;
        sponsorCode: string | null;
        createdAt: Date;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string | null;
        };
    }>;
}
