export declare class NotificationEntity {
    _id: string;
    id: string;
    userId: string;
    actorId: string;
    type: string;
    targetId: string;
    actorName?: string;
    actorAvatarUrl?: string;
    isRead: boolean;
    createdAt: Date;
}
