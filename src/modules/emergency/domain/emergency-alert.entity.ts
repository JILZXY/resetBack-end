export class EmergencyAlertEntity {
  id: string;
  userId: string;
  userAddictionId: string;
  activatedAt: Date;
  resultedInRelapse: boolean;
  resolutionNotes: string | null;
  createdAt: Date;
}