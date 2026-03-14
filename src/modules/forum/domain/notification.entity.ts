export class NotificationEntity {
  _id: string; // for frontend compatibility
  id: string; // for backend semantic consistency
  userId: string;
  actorId: string;
  type: string;
  targetId: string;
  actorName?: string;
  actorAvatarUrl?: string;
  isRead: boolean;
  createdAt: Date;
}
