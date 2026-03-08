import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BestStreaksUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    const result: any[] = await this.prisma.$queryRaw(
      Prisma.sql`
        SELECT user_id, addiction_name, days_achieved, completed_at, event_type, streak_rank, pct_of_best
        FROM tracking.v_user_best_streaks
        WHERE user_id = ${userId}::uuid
        ORDER BY streak_rank ASC
      `,
    );
    return result;
  }
}
