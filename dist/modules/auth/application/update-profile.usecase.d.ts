import { UserRepository } from '../infrastructure/repositories/user.repository';
import { UpdateProfileDto } from '../infrastructure/dtos/update-profile.dto';
export declare class UpdateProfileUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string, dto: UpdateProfileDto): Promise<import("../domain/user.entity").UserEntity | {
        id: string;
        name: string;
        email: string;
        role: string | null;
        sponsorCode: string | null;
    } | null>;
}
