import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class VerificationTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, token: string, expiresAt: Date) {
    // Eliminar tokens previos para ese usuario
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

  async findLatestByUserEmail(email: string) {
    // Buscamos el usuario primero para obtener su ID
    // Esto evita un bug conocido de Prisma 7 con filtros de relación en multi-schema usando el adaptador de pg
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) return null;

    return this.prisma.verificationToken.findFirst({
      where: {
        user_id: user.id,
        expires_at: { gt: new Date() },
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: true,
      },
    });
  }
}
