export class NotificationEntity {
  _id: string; // for frontend compatibility
  id: string; // for backend semantic consistency
  userId: string;
  actorId: string;
  type: string;
  targetId: string;
  isRead: boolean;
  createdAt: Date;
}
