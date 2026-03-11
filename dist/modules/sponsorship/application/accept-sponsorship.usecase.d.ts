import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { NotificationRepository } from '../../forum/infrastructure/repositories/notification.repository';
import { NotificationGateway } from '../../forum/notification.gateway';
export declare class AcceptSponsorshipUseCase {
    private readonly sponsorshipRepo;
    private readonly notificationRepo;
    private readonly notificationGateway;
    constructor(sponsorshipRepo: SponsorshipRepository, notificationRepo: NotificationRepository, notificationGateway: NotificationGateway);
    execute(userId: string): Promise<{
        message: string;
        sponsorship: import("../domain/sponsorship.entity").SponsorshipEntity;
    }>;
    private notifyAddict;
}
