import { Model } from 'mongoose';
import { ReportDocument } from '../../schemas/report.schema';
import { ReportEntity } from '../../domain/report.entity';
export declare class ReportRepository {
    private readonly reportModel;
    constructor(reportModel: Model<ReportDocument>);
    create(data: {
        reporterId: string;
        targetId: string;
        targetType: string;
        reason: string;
        details?: string;
    }): Promise<ReportEntity>;
    findByTargetId(targetId: string): Promise<ReportEntity[]>;
    private toEntity;
}
