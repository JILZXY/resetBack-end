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
exports.NotificationSchema = exports.Notification = exports.NotificationType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var NotificationType;
(function (NotificationType) {
    NotificationType["REACTION"] = "REACTION";
    NotificationType["COMMENT"] = "COMMENT";
    NotificationType["REPLY"] = "REPLY";
    NotificationType["REPORT_UPDATE"] = "REPORT_UPDATE";
    NotificationType["SPONSORSHIP_REQUEST"] = "SPONSORSHIP_REQUEST";
    NotificationType["SPONSORSHIP_ACCEPTED"] = "SPONSORSHIP_ACCEPTED";
    NotificationType["SPONSORSHIP_REJECTED"] = "SPONSORSHIP_REJECTED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
let Notification = class Notification {
    userId;
    actorId;
    type;
    targetId;
    actorName;
    actorAvatarUrl;
    isRead;
};
exports.Notification = Notification;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "actorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Object.values(NotificationType) }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "targetId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Notification.prototype, "actorName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Notification.prototype, "actorAvatarUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'notifications',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    })
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
//# sourceMappingURL=notification.schema.js.map