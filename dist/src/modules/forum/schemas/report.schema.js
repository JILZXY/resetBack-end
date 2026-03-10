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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSchema = exports.Report = exports.ReportStatus = exports.ReportReason = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var ReportReason;
(function (ReportReason) {
    ReportReason["SPAM"] = "SPAM";
    ReportReason["HARASSMENT"] = "HARASSMENT";
    ReportReason["HATE_SPEECH"] = "HATE_SPEECH";
    ReportReason["INAPPROPRIATE_CONTENT"] = "INAPPROPRIATE_CONTENT";
    ReportReason["OTHER"] = "OTHER";
})(ReportReason || (exports.ReportReason = ReportReason = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "PENDING";
    ReportStatus["REVIEWED"] = "REVIEWED";
    ReportStatus["DISMISSED"] = "DISMISSED";
    ReportStatus["ACTION_TAKEN"] = "ACTION_TAKEN";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
let Report = class Report {
    reporterId;
    targetId;
    targetType;
    reason;
    details;
    status;
};
exports.Report = Report;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "reporterId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "targetId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['post', 'comment'] }),
    __metadata("design:type", String)
], Report.prototype, "targetType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Object.values(ReportReason) }),
    __metadata("design:type", String)
], Report.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Report.prototype, "details", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: ReportStatus.PENDING, enum: Object.values(ReportStatus) }),
    __metadata("design:type", String)
], Report.prototype, "status", void 0);
exports.Report = Report = __decorate([
    (0, mongoose_1.Schema)({ collection: 'reports', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
], Report);
exports.ReportSchema = mongoose_1.SchemaFactory.createForClass(Report);
//# sourceMappingURL=report.schema.js.map