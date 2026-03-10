export class UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string | null;
  sponsorCode: string | null;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
