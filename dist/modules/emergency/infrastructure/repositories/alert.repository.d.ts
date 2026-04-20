import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { EmergencyAlertEntity } from '../../domain/emergency-alert.entity';
export declare class AlertRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        userId: string;
        userAddictionId: string;
        resultedInRelapse?: boolean;
        resolutionNotes?: string;
    }): Promise<EmergencyAlertEntity>;
    findAllByUserId(userId: string): Promise<EmergencyAlertEntity[]>;
    private toEntity;
}
