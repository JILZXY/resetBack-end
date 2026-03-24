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
exports.AlertRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/database/prisma/prisma.service");
const emergency_alert_entity_1 = require("../../domain/emergency-alert.entity");
let AlertRepository = class AlertRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const alert = await this.prisma.emergencyAlert.create({
            data: {
                user_id: data.userId,
                user_addiction_id: data.userAddictionId,
                resulted_in_relapse: data.resultedInRelapse ?? false,
                resolution_notes: data.resolutionNotes ?? '',
            },
        });
        return this.toEntity(alert);
    }
    async findAllByUserId(userId) {
        const alerts = await this.prisma.emergencyAlert.findMany({
            where: { user_id: userId },
            orderBy: { activated_at: 'desc' },
        });
        return alerts.map((a) => this.toEntity(a));
    }
    toEntity(raw) {
        const entity = new emergency_alert_entity_1.EmergencyAlertEntity();
        entity.id = raw.id;
        entity.userId = raw.user_id;
        entity.userAddictionId = raw.user_addiction_id;
        entity.activatedAt = raw.activated_at;
        entity.resultedInRelapse = raw.resulted_in_relapse;
        entity.resolutionNotes = raw.resolution_notes;
        entity.createdAt = raw.created_at;
        return entity;
    }
};
exports.AlertRepository = AlertRepository;
exports.AlertRepository = AlertRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertRepository);
//# sourceMappingURL=alert.repository.js.map