export class UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string | null;
  sponsorCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}
