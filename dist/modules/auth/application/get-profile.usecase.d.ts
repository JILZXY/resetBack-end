import { UserRepository } from '../infrastructure/repositories/user.repository';
export declare class GetProfileUseCase {
    private readonly userRepo;
    constructor(userRepo: UserRepository);
    execute(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: string | null;
        sponsorCode: string | null;
        avatarUrl: string;
        createdAt: Date;
        addiction: any;
    }>;
}
