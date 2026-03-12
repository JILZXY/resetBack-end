import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
export declare class GetGodchildProfileUseCase {
    private readonly sponsorshipRepo;
    private readonly prisma;
    constructor(sponsorshipRepo: SponsorshipRepository, prisma: PrismaService);
    execute(userId: string): Promise<{
        godchild: {
            id: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            addiction: {
                custom_name: string;
                classification: string;
                is_active: boolean;
                registered_at: Date;
            };
        };
        sponsorship: {
            id: string;
            startedAt: Date;
            status: string;
        };
        statistics: {
            dayCounter: any;
            averageCraving: any;
            averageEmotionalState: any;
            streakStatus: any;
            totalRelapses: any;
        };
        recentLogs: {
            logDate: Date;
            consumed: boolean;
            cravingLevel: {
                level: number;
                label: string;
            };
            emotionalState: {
                level: number;
                label: string;
            };
            triggers: string;
            notes: string;
        }[];
    }>;
}
