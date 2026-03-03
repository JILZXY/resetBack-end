export class SponsorshipEntity {
  id: string;
  sponsorId: string;
  addictId: string;
  startedAt: Date;
  endedAt: Date;
  isActive: boolean;
  terminationReason: string;
  createdAt: Date;
}
