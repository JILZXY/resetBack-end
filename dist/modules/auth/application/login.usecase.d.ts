import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { TrustedDeviceRepository } from '../infrastructure/repositories/trusted-device.repository';
import { VerificationTokenRepository } from '../infrastructure/repositories/verification-token.repository';
import { MailService } from 'src/shared/mail/mail.service';
import { LoginDto } from '../infrastructure/dtos/login.dto';
export declare class LoginUseCase {
    private readonly userRepo;
    private readonly jwtService;
    private readonly trustedDeviceRepo;
    private readonly tokenRepo;
    private readonly mailService;
    constructor(userRepo: UserRepository, jwtService: JwtService, trustedDeviceRepo: TrustedDeviceRepository, tokenRepo: VerificationTokenRepository, mailService: MailService);
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
        code: string;
        message: string;
        mfaToken: string;
    }>;
    private generateTokenResponse;
}
