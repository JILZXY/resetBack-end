import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class VerificationTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, token: string, expiresAt: Date) {
    await this.prisma.verificationToken.deleteMany({
      where: { user_id: userId },
    });

    return this.prisma.verificationToken.create({
      data: {
        user_id: userId,
        token,
        expires_at: expiresAt,
      },
    });
  }

  async findByToken(token: string) {
    return this.prisma.verificationToken.findFirst({
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
    await this.prisma.verificationToken.delete({
      where: { id },
    });
  }
}
