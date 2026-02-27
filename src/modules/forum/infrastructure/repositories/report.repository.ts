import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from '../../schemas/report.schema';
import { ReportEntity } from '../../domain/report.entity';

@Injectable()
export class ReportRepository {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>,
  ) {}

  async create(data: {
    reporterId: string;
    targetId: string;
    targetType: string;
    reason: string;
    details?: string;
  }): Promise<ReportEntity> {
    const report = await this.reportModel.create(data);
    return this.toEntity(report);
  }

  async findByTargetId(targetId: string): Promise<ReportEntity[]> {
    const reports = await this.reportModel
      .find({ targetId })
      .sort({ createdAt: -1 })
      .exec();
    return reports.map((r) => this.toEntity(r));
  }

  private toEntity(raw: ReportDocument): ReportEntity {
    const entity = new ReportEntity();
    entity.id = (raw._id as any).toString();
    entity.reporterId = raw.reporterId;
    entity.targetId = raw.targetId;
    entity.targetType = raw.targetType;
    entity.reason = raw.reason;
    entity.details = raw.details;
    entity.status = raw.status;
    entity.createdAt = (raw as any).createdAt;
    entity.updatedAt = (raw as any).updatedAt;
    return entity;
  }
}
