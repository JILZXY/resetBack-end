import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UserEntity } from '../../domain/user.entity';
export declare class UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<UserEntity | null>;
    findByEmailIncludeDeleted(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    findBySponsorCode(code: string): Promise<UserEntity | null>;
    create(data: {
        name: string;
        email: string;
        passwordHash: string;
        role?: string;
        addictionName?: string;
        classification?: string;
    }): Promise<UserEntity>;
    softDelete(id: string): Promise<void>;
    reactivate(id: string): Promise<void>;
    private toEntity;
}
