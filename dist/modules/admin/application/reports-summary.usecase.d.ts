import { Model } from 'mongoose';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';
import { ReportDocument } from '../../forum/schemas/report.schema';
export declare class ReportsSummaryUseCase {
    private readonly reportModel;
    constructor(reportModel: Model<ReportDocument>);
    execute(filter: MetricsFilterDto): Promise<{
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
