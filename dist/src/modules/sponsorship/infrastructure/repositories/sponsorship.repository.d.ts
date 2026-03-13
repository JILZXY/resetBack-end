import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { SponsorshipEntity } from '../../domain/sponsorship.entity';
export declare class SponsorshipRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createRequest(sponsorId: string, addictId: string): Promise<SponsorshipEntity>;
    accept(id: string): Promise<SponsorshipEntity>;
    reject(id: string): Promise<void>;
    setInactive(id: string, reason: string): Promise<SponsorshipEntity>;
    findActiveByAddictId(addictId: string): Promise<SponsorshipEntity | null>;
    findActiveBySponsorId(sponsorId: string): Promise<SponsorshipEntity | null>;
    findPendingByAddictId(addictId: string): Promise<SponsorshipEntity | null>;
    findPendingBySponsorId(sponsorId: string): Promise<SponsorshipEntity | null>;
    findById(id: string): Promise<SponsorshipEntity | null>;
    checkActiveSponsorship(sponsorId: string, addictId: string): Promise<boolean>;
    private toEntity;
}
