import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { RequestSponsorshipDto } from '../infrastructure/dtos/request-sponsorship.dto';
import { UserRepository } from '../../auth/infrastructure/repositories/user.repository';
import { NotificationRepository } from '../../forum/infrastructure/repositories/notification.repository';
import { NotificationGateway } from '../../forum/notification.gateway';
import { NotificationService } from '../../emergency/infrastructure/services/notification.service';
export declare class RequestSponsorshipUseCase {
    private readonly sponsorshipRepo;
    private readonly userRepo;
    private readonly notificationRepo;
    private readonly notificationGateway;
    private readonly emailService;
    constructor(sponsorshipRepo: SponsorshipRepository, userRepo: UserRepository, notificationRepo: NotificationRepository, notificationGateway: NotificationGateway, emailService: NotificationService);
    execute(userId: string, dto: RequestSponsorshipDto): Promise<{
        message: string;
        sponsorship: import("../domain/sponsorship.entity").SponsorshipEntity;
    }>;
    private notifySponsorship;
}
