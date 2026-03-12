import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';
import { Post, PostDocument } from '../../forum/schemas/post.schema';
import { Comment, CommentDocument } from '../../forum/schemas/comment.schema';

@Injectable()
export class CorrelationMetricsUseCase {
  constructor(
    private readonly prisma: PrismaService,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async execute(filter: MetricsFilterDto) {
    const logWhere: any = {};
    if (filter.from || filter.to) {
      logWhere.log_date = {};
      if (filter.from) logWhere.log_date.gte = new Date(filter.from);
      if (filter.to) logWhere.log_date.lte = new Date(filter.to);
    }

    // 1. Obtener todos los user IDs activos (que tienen al menos un log)
    const allUsersWithLogs = await this.prisma.dailyLog.groupBy({
      by: ['user_id'],
      where: logWhere,
    });
    const allUserIds = allUsersWithLogs.map((u) => u.user_id);

    // 2. Identificar usuarios del foro (tienen al menos 1 post o comentario)
    const postAuthors = await this.postModel.distinct('authorId', {
      isDeleted: false,
    });
    const commentAuthors = await this.commentModel.distinct('authorId', {
      isDeleted: false,
    });
    const forumUserIds = new Set<string>([...postAuthors, ...commentAuthors]);

    // 3. Separar en dos grupos
    const usersWithForum = allUserIds.filter((id) => forumUserIds.has(id));
    const usersWithoutForum = allUserIds.filter((id) => !forumUserIds.has(id));

    // 4. Calcular métricas para cada grupo
    const [forumGroupMetrics, noForumGroupMetrics] = await Promise.all([
      this.getGroupMetrics(usersWithForum, logWhere),
      this.getGroupMetrics(usersWithoutForum, logWhere),
    ]);

    return {
      forumUsers: {
        count: usersWithForum.length,
        ...forumGroupMetrics,
      },
      nonForumUsers: {
        count: usersWithoutForum.length,
        ...noForumGroupMetrics,
      },
    };
  }

  private async getGroupMetrics(userIds: string[], logWhere: any) {
    if (userIds.length === 0) {
      return {
        avgLogsPerUser: 0,
        avgCraving: null,
        avgEmotion: null,
        avgStreakDays: 0,
        relapseRate: 0,
      };
    }

    const where = {
      ...logWhere,
      user_id: { in: userIds },
    };

    // Obtener logs con sus relaciones de nivel
    const logs = await this.prisma.dailyLog.findMany({
      where,
      include: { craving_level: true, emotional_state: true },
    });

    const totalLogs = logs.length;
    const consumedLogs = logs.filter((l) => l.consumed).length;

    // Promedios de craving y emoción usando los niveles numéricos de las relaciones
    const logsWithCraving = logs.filter((l) => l.craving_level !== null);
    const logsWithEmotion = logs.filter((l) => l.emotional_state !== null);

    const avgCraving =
      logsWithCraving.length > 0
        ? Number(
            (
              logsWithCraving.reduce(
                (sum, l) => sum + l.craving_level!.level,
                0,
              ) / logsWithCraving.length
            ).toFixed(2),
          )
        : null;

    const avgEmotion =
      logsWithEmotion.length > 0
        ? Number(
            (
              logsWithEmotion.reduce(
                (sum, l) => sum + l.emotional_state!.level,
                0,
              ) / logsWithEmotion.length
            ).toFixed(2),
          )
        : null;

    // Promedio de días de racha
    const streaks = await this.prisma.streak.findMany({
      where: { user_id: { in: userIds } },
      select: { day_counter: true },
    });

    const avgStreakDays =
      streaks.length > 0
        ? Number(
            (
              streaks.reduce((sum, s) => sum + s.day_counter, 0) /
              streaks.length
            ).toFixed(2),
          )
        : 0;

    return {
      avgLogsPerUser:
        userIds.length > 0
          ? Number((totalLogs / userIds.length).toFixed(2))
          : 0,
      avgCraving,
      avgEmotion,
      avgStreakDays,
      relapseRate:
        totalLogs > 0
          ? Number(((consumedLogs / totalLogs) * 100).toFixed(2))
          : 0,
    };
  }
}
