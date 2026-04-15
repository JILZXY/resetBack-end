import { VerificationTokenRepository } from '../infrastructure/repositories/verification-token.repository';
export declare class GetDebugTokenUseCase {
    private readonly tokenRepo;
    constructor(tokenRepo: VerificationTokenRepository);
    execute(email: string): Promise<{
        email: string;
        token: string;
        type: string;
        expiresAt: Date;
    }>;
}
