export class StreakEventEntity {
  id: string;
  streakId: string;
  emergencyAlertId: string | null;
  eventType: string | null;
  eventDate: Date;
  daysAchieved: number | null;
  avgCravingPeriod: number | null;
  avgEmotionPeriod: number | null;
  createdAt: Date;
}