import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MovingAverageUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    const result: any[] = await this.prisma.$queryRaw(
      Prisma.sql`
        SELECT user_id, log_date, daily_craving, rolling_avg_craving_7d, rolling_avg_emotion_7d
        FROM tracking.v_user_craving_moving_avg
        WHERE user_id = ${userId}::uuid
        ORDER BY log_date DESC
      `,
    );
    return result;
  }
}
