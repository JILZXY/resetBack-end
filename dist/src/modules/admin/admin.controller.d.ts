import { MetricsFilterDto } from './infrastructure/dtos/metrics-filter.dto';
import { OverviewMetricsUseCase } from './application/overview-metrics.usecase';
import { LogsFrequencyUseCase } from './application/logs-frequency.usecase';
import { ForumEngagementUseCase } from './application/forum-engagement.usecase';
import { CorrelationMetricsUseCase } from './application/correlation-metrics.usecase';
import { LogsByAddictionUseCase } from './application/logs-by-addiction.usecase';
import { EmotionalTrendsUseCase } from './application/emotional-trends.usecase';
import { StreaksSummaryUseCase } from './application/streaks-summary.usecase';
import { ReportsSummaryUseCase } from './application/reports-summary.usecase';
export declare class AdminController {
    private readonly overview;
    private readonly logsFrequency;
    private readonly forumEngagement;
    private readonly correlation;
    private readonly logsByAddiction;
    private readonly emotionalTrends;
    private readonly streaksSummary;
    private readonly reportsSummary;
    constructor(overview: OverviewMetricsUseCase, logsFrequency: LogsFrequencyUseCase, forumEngagement: ForumEngagementUseCase, correlation: CorrelationMetricsUseCase, logsByAddiction: LogsByAddictionUseCase, emotionalTrends: EmotionalTrendsUseCase, streaksSummary: StreaksSummaryUseCase, reportsSummary: ReportsSummaryUseCase);
    getOverview(): Promise<{
        users: {
            total: number;
            activeLoggers: number;
        };
        tracking: {
            totalLogs: number;
            totalStreaks: number;
            activeStreaks: number;
        };
        forum: {
            totalPosts: number;
            totalComments: number;
            totalReactions: number;
        };
    }>;
    getLogsFrequency(filter: MetricsFilterDto): Promise<{
        summary: {
            totalLogs: number;
            avgLogsPerDay: number;
            logsWithConsumption: number;
            logsClean: number;
            uniqueUsersLogging: number;
        };
        daily: {
            date: Date;
            count: number;
        }[];
    }>;
    getForumEngagement(filter: MetricsFilterDto): Promise<{
        summary: {
            totalPosts: number;
            totalComments: number;
            totalReactions: number;
            uniqueForumUsers: number;
            uniquePostAuthors: number;
            uniqueCommenters: number;
        };
        postsByDay: {
            date: any;
            count: any;
        }[];
    }>;
    getCorrelation(filter: MetricsFilterDto): Promise<{
        forumUsers: {
            avgLogsPerUser: number;
            avgCraving: number | null;
            avgEmotion: number | null;
            avgStreakDays: number;
            relapseRate: number;
            count: number;
        };
        nonForumUsers: {
            avgLogsPerUser: number;
            avgCraving: number | null;
            avgEmotion: number | null;
            avgStreakDays: number;
            relapseRate: number;
            count: number;
        };
    }>;
    getLogsByAddiction(filter: MetricsFilterDto): Promise<{
        byClassification: any[];
        byAddictionName: any[];
    }>;
    getEmotionalTrends(filter: MetricsFilterDto): Promise<{
        global: {
            avgCraving: number | null;
            avgEmotion: number | null;
            totalLogs: number;
        };
        daily: {
            date: string;
            avgCraving: number | null;
            avgEmotion: number | null;
            logCount: number;
        }[];
        cravingDistribution: {
            level: number;
            count: number;
        }[];
        emotionDistribution: {
            level: number;
            count: number;
        }[];
    }>;
    getStreaksSummary(): Promise<{
        summary: {
            totalStreaks: number;
            activeStreaks: number;
            brokenStreaks: number;
            relapseRate: number;
        };
        averages: {
            avgDaysAll: number;
            maxDaysAll: number;
            avgDaysActive: number;
            maxDaysActive: number;
        };
        distribution: {
            '0-7': number;
            '8-14': number;
            '15-30': number;
            '31-60': number;
            '61-90': number;
            '90+': number;
        };
    }>;
    getReportsSummary(filter: MetricsFilterDto): Promise<{
        totalReports: number;
        byReason: {
            reason: any;
            count: any;
        }[];
        byStatus: {
            status: any;
            count: any;
        }[];
        byTargetType: {
            targetType: any;
            count: any;
        }[];
    }>;
}
