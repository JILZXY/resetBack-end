import { UserRepository } from '../infrastructure/repositories/user.repository';
import { ReactivateDto } from '../infrastructure/dtos/reactivate.dto';
export declare class ReactivateAccountUseCase {
    private readonly userRepo;
    constructor(userRepo: UserRepository);
    execute(dto: ReactivateDto): Promise<{
        message: string;
    }>;
}
