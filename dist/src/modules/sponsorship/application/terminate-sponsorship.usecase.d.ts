import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { TerminateSponsorshipDto } from '../infrastructure/dtos/terminate-sponsorship.dto';
export declare class TerminateSponsorshipUseCase {
    private readonly sponsorshipRepo;
    constructor(sponsorshipRepo: SponsorshipRepository);
    execute(userId: string, sponsorshipId: string, dto: TerminateSponsorshipDto): Promise<{
        message: string;
        sponsorshipId: string;
    }>;
}
