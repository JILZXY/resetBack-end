import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class TrustedDeviceRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, deviceIdentifier: string, deviceName?: string): Promise<{
        id: string;
        created_at: Date;
        user_id: string;
        expires_at: Date;
        device_identifier: string;
        device_name: string | null;
        last_used_at: Date;
    }>;
    findValidDevice(userId: string, deviceIdentifier: string): Promise<{
        id: string;
        created_at: Date;
        user_id: string;
        expires_at: Date;
        device_identifier: string;
        device_name: string | null;
        last_used_at: Date;
    } | null>;
    updateLastUsed(id: string): Promise<void>;
    delete(deviceIdentifier: string): Promise<void>;
}
