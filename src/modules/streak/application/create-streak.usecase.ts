import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { StreakRepository } from '../infrastructure/repositories/streak.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class CreateStreakUseCase {
  constructor(
    private readonly streakRepo: StreakRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string): Promise<void> {
    const existing = await this.streakRepo.findByUserId(userId);
    if (existing) return;

    const addiction = await this.prisma.userAddiction.findUnique({
      where: { user_id: userId },
    });

    if (!addiction) {
      throw new HttpException(
        {
          code: 'ADDICTION_NOT_FOUND',
          message: 'El usuario no tiene una adicción registrada. Registra una antes de iniciar una racha',
          details: { user_id: userId },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.streakRepo.create({
      userId,
      userAddictionId: addiction.id,
      startedAt: new Date(),
    });
  }
}