export class DailyLogEntity {
  id: string;
  userId: string;
  logDate: Date;
  consumed: boolean;
  cravingLevelId: string | null;
  emotionalStateId: string | null;
  triggers: string | null;
  notes: string | null;
  createdAt: Date;
}