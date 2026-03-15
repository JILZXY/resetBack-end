import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LatestLogUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    const result: any[] = await this.prisma.$queryRaw(
      Prisma.sql`SELECT * FROM tracking.v_user_latest_log WHERE user_id = ${userId}::uuid`,
    );
    return result.length > 0 ? result[0] : null;
  }
}
