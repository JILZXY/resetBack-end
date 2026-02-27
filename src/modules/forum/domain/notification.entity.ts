export class NotificationEntity {
  id: string;
  userId: string;
  actorId: string;
  type: string;
  targetId: string;
  isRead: boolean;
  createdAt: Date;
}
