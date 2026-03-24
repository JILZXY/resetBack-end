export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string | null;
    sponsorCode: string | null;
    avatarUrl: string;
    isVerified: boolean;
    twoFactorEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    addictions?: any[];
}
