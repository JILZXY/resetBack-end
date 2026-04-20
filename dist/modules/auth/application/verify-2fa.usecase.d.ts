import { JwtService } from '@nestjs/jwt';
import { VerificationTokenRepository } from '../infrastructure/repositories/verification-token.repository';
import { TrustedDeviceRepository } from '../infrastructure/repositories/trusted-device.repository';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { Verify2FADto } from '../infrastructure/dtos/verify-2fa.dto';
export declare class Verify2FAUseCase {
    private readonly jwtService;
    private readonly tokenRepo;
    private readonly trustedDeviceRepo;
    private readonly userRepo;
    constructor(jwtService: JwtService, tokenRepo: VerificationTokenRepository, trustedDeviceRepo: TrustedDeviceRepository, userRepo: UserRepository);
    execute(dto: Verify2FADto): Promise<{
        newDeviceId: string | undefined;
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
