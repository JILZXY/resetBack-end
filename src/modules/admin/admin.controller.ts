import {
  Controller,
  Get,
  Query,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../auth/guards/roles.guard';
import { MetricsFilterDto } from './infrastructure/dtos/metrics-filter.dto';
import { OverviewMetricsUseCase } from './application/overview-metrics.usecase';
import { LogsFrequencyUseCase } from './application/logs-frequency.usecase';
import { ForumEngagementUseCase } from './application/forum-engagement.usecase';
import { CorrelationMetricsUseCase } from './application/correlation-metrics.usecase';
import { LogsByAddictionUseCase } from './application/logs-by-addiction.usecase';
import { EmotionalTrendsUseCase } from './application/emotional-trends.usecase';
import { StreaksSummaryUseCase } from './application/streaks-summary.usecase';
import { ReportsSummaryUseCase } from './application/reports-summary.usecase';

@Controller('admin/metrics')
@UseGuards(JwtAuthGuard, RolesGuard)
@SetMetadata(ROLES_KEY, ['ADMIN'])
export class AdminController {
  constructor(
    private readonly overview: OverviewMetricsUseCase,
    private readonly logsFrequency: LogsFrequencyUseCase,
    private readonly forumEngagement: ForumEngagementUseCase,
    private readonly correlation: CorrelationMetricsUseCase,
    private readonly logsByAddiction: LogsByAddictionUseCase,
    private readonly emotionalTrends: EmotionalTrendsUseCase,
    private readonly streaksSummary: StreaksSummaryUseCase,
    private readonly reportsSummary: ReportsSummaryUseCase,
  ) {}

  @Get('overview')
  getOverview() {
    return this.overview.execute();
  }

  @Get('logs-frequency')
  getLogsFrequency(@Query() filter: MetricsFilterDto) {
    return this.logsFrequency.execute(filter);
  }

  @Get('forum-engagement')
  getForumEngagement(@Query() filter: MetricsFilterDto) {
    return this.forumEngagement.execute(filter);
  }

  @Get('correlation')
  getCorrelation(@Query() filter: MetricsFilterDto) {
    return this.correlation.execute(filter);
  }

  @Get('logs-by-addiction')
  getLogsByAddiction(@Query() filter: MetricsFilterDto) {
    return this.logsByAddiction.execute(filter);
  }

  @Get('emotional-trends')
  getEmotionalTrends(@Query() filter: MetricsFilterDto) {
    return this.emotionalTrends.execute(filter);
  }

  @Get('streaks-summary')
  getStreaksSummary() {
    return this.streaksSummary.execute();
  }

  @Get('reports-summary')
  getReportsSummary(@Query() filter: MetricsFilterDto) {
    return this.reportsSummary.execute(filter);
  }
}
