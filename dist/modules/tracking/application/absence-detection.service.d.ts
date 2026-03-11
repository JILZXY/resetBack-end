import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class AbsenceDetectionService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleAbsenceDetection(): Promise<void>;
}
