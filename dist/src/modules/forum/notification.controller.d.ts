import { NotificationRepository } from './infrastructure/repositories/notification.repository';
export declare class NotificationController {
    private readonly notificationRepo;
    constructor(notificationRepo: NotificationRepository);
    getMyNotifications(req: any): Promise<import("./domain/notification.entity").NotificationEntity[]>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    markAsRead(req: any, id: string): Promise<{
        message: string;
    }>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
}
