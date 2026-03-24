import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { LoginDto } from '../infrastructure/dtos/login.dto';
export declare class AdminLoginUseCase {
    private readonly userRepo;
    private readonly jwtService;
    constructor(userRepo: UserRepository, jwtService: JwtService);
    execute(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
    }>;
    private generateTokenResponse;
}
