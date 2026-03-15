import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { NotificationRepository } from '../../forum/infrastructure/repositories/notification.repository';
import { NotificationGateway } from '../../forum/notification.gateway';
import { UserRepository } from '../../auth/infrastructure/repositories/user.repository';
export declare class RejectSponsorshipUseCase {
    private readonly sponsorshipRepo;
    private readonly notificationRepo;
    private readonly notificationGateway;
    private readonly userRepo;
    constructor(sponsorshipRepo: SponsorshipRepository, notificationRepo: NotificationRepository, notificationGateway: NotificationGateway, userRepo: UserRepository);
    execute(userId: string): Promise<{
        message: string;
    }>;
    private notifyAddict;
}
