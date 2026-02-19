export class UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string | null;
  createdAt: Date;
  updatedAt: Date;
}