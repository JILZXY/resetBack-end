import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { TrustedDeviceRepository } from '../infrastructure/repositories/trusted-device.repository';
import { LoginDto } from '../infrastructure/dtos/login.dto';
export declare class LoginUseCase {
    private readonly userRepo;
    private readonly jwtService;
    private readonly trustedDeviceRepo;
    constructor(userRepo: UserRepository, jwtService: JwtService, trustedDeviceRepo: TrustedDeviceRepository);
    execute(dto: LoginDto, deviceIdFromCookie?: string): Promise<{
        accessToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            sponsorCode: any;
        };
    } | {
        newDeviceId: string;
        accessToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            sponsorCode: any;
        };
    }>;
    private generateTokenResponse;
}
