import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MetricsFilterDto } from '../infrastructure/dtos/metrics-filter.dto';
import { Report, ReportDocument } from '../../forum/schemas/report.schema';

@Injectable()
export class ReportsSummaryUseCase {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>,
  ) {}

  async execute(filter: MetricsFilterDto) {
    const dateFilter: any = {};
    if (filter.from) dateFilter.$gte = new Date(filter.from);
    if (filter.to) dateFilter.$lte = new Date(filter.to);
    const hasDateFilter = Object.keys(dateFilter).length > 0;

    const query: any = {};
    if (hasDateFilter) query.createdAt = dateFilter;

    const totalReports = await this.reportModel.countDocuments(query);

    // Por razón
    const byReason = await this.reportModel.aggregate([
      { $match: query },
      { $group: { _id: '$reason', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Por estado
    const byStatus = await this.reportModel.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Por tipo de target
    const byTargetType = await this.reportModel.aggregate([
      { $match: query },
      { $group: { _id: '$targetType', count: { $sum: 1 } } },
    ]);

    return {
      totalReports,
      byReason: byReason.map((r) => ({ reason: r._id, count: r.count })),
      byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })),
      byTargetType: byTargetType.map((t) => ({ targetType: t._id, count: t.count })),
    };
  }
}
