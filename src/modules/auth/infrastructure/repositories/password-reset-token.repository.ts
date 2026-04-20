import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class PasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, token: string, expiresAt: Date) {
    await this.prisma.passwordResetToken.deleteMany({
      where: { user_id: userId },
    });

    return this.prisma.passwordResetToken.create({
      data: {
        user_id: userId,
        token,
        expires_at: expiresAt,
      },
    });
  }

  async findByToken(token: string) {
    return this.prisma.passwordResetToken.findFirst({
      where: {
        token,
        expires_at: { gt: new Date() },
      },
      include: {
        user: true,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.passwordResetToken.delete({
      where: { id },
    });
  }
}
