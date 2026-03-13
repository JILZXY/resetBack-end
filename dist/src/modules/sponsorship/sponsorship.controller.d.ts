import { RequestSponsorshipUseCase } from './application/assign-sponsor.usecase';
import { AcceptSponsorshipUseCase } from './application/accept-sponsorship.usecase';
import { RejectSponsorshipUseCase } from './application/reject-sponsorship.usecase';
import { TerminateSponsorshipUseCase } from './application/terminate-sponsorship.usecase';
import { GraduateSponsorUseCase } from './application/graduate-sponsor.usecase';
import { GetGodchildProfileUseCase } from './application/get-godchild-profile.usecase';
import { RequestSponsorshipDto } from './infrastructure/dtos/request-sponsorship.dto';
import { TerminateSponsorshipDto } from './infrastructure/dtos/terminate-sponsorship.dto';
export declare class SponsorshipController {
    private readonly requestUseCase;
    private readonly acceptUseCase;
    private readonly rejectUseCase;
    private readonly terminateUseCase;
    private readonly graduateUseCase;
    private readonly godchildProfileUseCase;
    constructor(requestUseCase: RequestSponsorshipUseCase, acceptUseCase: AcceptSponsorshipUseCase, rejectUseCase: RejectSponsorshipUseCase, terminateUseCase: TerminateSponsorshipUseCase, graduateUseCase: GraduateSponsorUseCase, godchildProfileUseCase: GetGodchildProfileUseCase);
    request(req: any, dto: RequestSponsorshipDto): Promise<{
        message: string;
        sponsorship: import("./domain/sponsorship.entity").SponsorshipEntity;
    }>;
    accept(req: any): Promise<{
        message: string;
        sponsorship: import("./domain/sponsorship.entity").SponsorshipEntity;
    }>;
    reject(req: any): Promise<{
        message: string;
    }>;
    terminate(req: any, sponsorshipId: string, dto: TerminateSponsorshipDto): Promise<{
        message: string;
        sponsorshipId: string;
    }>;
    graduate(req: any): Promise<{
        message: string;
        sponsorCode: any;
    }>;
    godchildProfile(req: any): Promise<{
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
