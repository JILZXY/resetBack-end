import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SponsorshipRepository } from '../infrastructure/repositories/sponsorship.repository';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class GetGodchildProfileUseCase {
  constructor(
    private readonly sponsorshipRepo: SponsorshipRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string) {
    // Buscar relación activa donde el usuario sea el padrino
    const sponsorship =
      await this.sponsorshipRepo.findActiveBySponsorId(userId);

    if (!sponsorship) {
      throw new HttpException(
        {
          code: 'NO_ACTIVE_GODCHILD',
          message: 'No tienes un ahijado activo',
          details: {},
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const addictId = sponsorship.addictId;

    // Obtener datos del ahijado (excluyendo campos sensibles)
    const user = await this.prisma.user.findUnique({
      where: { id: addictId },
      select: {
        id: true,
        name: true,
        role: true,
        created_at: true,
        addictions: {
          select: {
            custom_name: true,
            classification: true,
            is_active: true,
            registered_at: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('Ahijado no encontrado', HttpStatus.NOT_FOUND);
    }

    // Obtener estadísticas del ahijado
    const stats = await this.prisma.$queryRaw<any[]>`
      SELECT * FROM core.fn_get_user_stats(${addictId}::uuid)
    `;
    const rawStats = stats[0] || {};

    // Obtener últimos 10 logs
    const recentLogs = await this.prisma.dailyLog.findMany({
      where: { user_id: addictId },
      orderBy: { log_date: 'desc' },
      take: 10,
      include: {
        craving_level: { select: { level: true, label: true } },
        emotional_state: { select: { level: true, label: true } },
      },
    });

    return {
      godchild: {
        id: user.id,
        name: user.name,
        role: user.role,
        createdAt: user.created_at,
        addiction: user.addictions?.[0] ?? null,
      },
      sponsorship: {
        id: sponsorship.id,
        startedAt: sponsorship.startedAt,
        status: sponsorship.status,
      },
      statistics: {
        dayCounter: rawStats.day_counter ?? 0,
        averageCraving: rawStats.avg_craving ?? 0,
        averageEmotionalState: rawStats.avg_emotion ?? 0,
        streakStatus: rawStats.streak_status ?? 'N/A',
        totalRelapses: rawStats.total_relapses ?? 0,
      },
      recentLogs: recentLogs.map((log) => ({
        logDate: log.log_date,
        consumed: log.consumed,
        cravingLevel: log.craving_level,
        emotionalState: log.emotional_state,
        triggers: log.triggers,
        notes: log.notes,
      })),
    };
  }
}
