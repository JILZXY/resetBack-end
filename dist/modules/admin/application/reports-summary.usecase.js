"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsSummaryUseCase = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const report_schema_1 = require("../../forum/schemas/report.schema");
let ReportsSummaryUseCase = class ReportsSummaryUseCase {
    reportModel;
    constructor(reportModel) {
        this.reportModel = reportModel;
    }
    async execute(filter) {
        const dateFilter = {};
        if (filter.from)
            dateFilter.$gte = new Date(filter.from);
        if (filter.to)
            dateFilter.$lte = new Date(filter.to);
        const hasDateFilter = Object.keys(dateFilter).length > 0;
        const query = {};
        if (hasDateFilter)
            query.createdAt = dateFilter;
        const totalReports = await this.reportModel.countDocuments(query);
        const byReason = await this.reportModel.aggregate([
            { $match: query },
            { $group: { _id: '$reason', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        const byStatus = await this.reportModel.aggregate([
            { $match: query },
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        const byTargetType = await this.reportModel.aggregate([
            { $match: query },
            { $group: { _id: '$targetType', count: { $sum: 1 } } },
        ]);
        return {
            totalReports,
            byReason: byReason.map((r) => ({ reason: r._id, count: r.count })),
            byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })),
            byTargetType: byTargetType.map((t) => ({
                targetType: t._id,
                count: t.count,
            })),
        };
    }
};
exports.ReportsSummaryUseCase = ReportsSummaryUseCase;
exports.ReportsSummaryUseCase = ReportsSummaryUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(report_schema_1.Report.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReportsSummaryUseCase);
//# sourceMappingURL=reports-summary.usecase.js.map