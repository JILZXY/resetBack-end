import { Model } from 'mongoose';
import { NotificationDocument } from '../../schemas/notification.schema';
import { NotificationEntity } from '../../domain/notification.entity';
export declare class NotificationRepository {
    private readonly notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    create(data: {
        userId: string;
        actorId: string;
        type: string;
        targetId: string;
        actorName?: string;
        actorAvatarUrl?: string;
    }): Promise<NotificationEntity>;
    findByUserId(userId: string): Promise<NotificationEntity[]>;
    markAsRead(id: string): Promise<void>;
    private toEntity;
    countUnread(userId: string): Promise<number>;
    markAsReadByCriteria(criteria: {
        userId: string;
        actorId?: string;
        type?: string;
    }): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
}
