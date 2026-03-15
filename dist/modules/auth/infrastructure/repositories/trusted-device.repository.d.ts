import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class TrustedDeviceRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, deviceIdentifier: string, deviceName?: string): Promise<any>;
    findValidDevice(userId: string, deviceIdentifier: string): Promise<any>;
    updateLastUsed(id: string): Promise<void>;
    delete(deviceIdentifier: string): Promise<void>;
}
