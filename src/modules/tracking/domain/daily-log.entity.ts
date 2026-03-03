export class DailyLogEntity {
  id: string;
  userId: string;
  logDate: Date;
  consumed: boolean;
  cravingLevelId: string;
  emotionalStateId: string;
  triggers: string;
  notes: string;
  createdAt: Date;
}