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
exports.ReportRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const report_schema_1 = require("../../schemas/report.schema");
const report_entity_1 = require("../../domain/report.entity");
let ReportRepository = class ReportRepository {
    reportModel;
    constructor(reportModel) {
        this.reportModel = reportModel;
    }
    async create(data) {
        const report = await this.reportModel.create(data);
        return this.toEntity(report);
    }
    async findByTargetId(targetId) {
        const reports = await this.reportModel
            .find({ targetId })
            .sort({ createdAt: -1 })
            .exec();
        return reports.map((r) => this.toEntity(r));
    }
    toEntity(raw) {
        const entity = new report_entity_1.ReportEntity();
        entity.id = raw._id.toString();
        entity.reporterId = raw.reporterId;
        entity.targetId = raw.targetId;
        entity.targetType = raw.targetType;
        entity.reason = raw.reason;
        entity.details = raw.details;
        entity.status = raw.status;
        entity.createdAt = raw.createdAt;
        entity.updatedAt = raw.updatedAt;
        return entity;
    }
};
exports.ReportRepository = ReportRepository;
exports.ReportRepository = ReportRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(report_schema_1.Report.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReportRepository);
//# sourceMappingURL=report.repository.js.map