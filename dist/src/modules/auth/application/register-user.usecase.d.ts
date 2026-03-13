import { UserRepository } from '../infrastructure/repositories/user.repository';
import { RegisterDto } from '../infrastructure/dtos/register.dto';
export declare class RegisterUserUseCase {
    private readonly userRepo;
    constructor(userRepo: UserRepository);
    execute(dto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: string | null;
        sponsorCode: string | null;
        createdAt: Date;
    }>;
}
