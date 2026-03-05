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
var AbsenceDetectionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsenceDetectionService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let AbsenceDetectionService = AbsenceDetectionService_1 = class AbsenceDetectionService {
    prisma;
    logger = new common_1.Logger(AbsenceDetectionService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleAbsenceDetection() {
        this.logger.log('Ejecutando detección de ausencias...');
        try {
            await this.prisma.$queryRawUnsafe('SELECT tracking.fn_detect_absence()');
            this.logger.log('Detección de ausencias completada exitosamente');
        }
        catch (error) {
            this.logger.error('Error en detección de ausencias:', error);
        }
    }
};
exports.AbsenceDetectionService = AbsenceDetectionService;
__decorate([
    (0, schedule_1.Cron)('0 3 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AbsenceDetectionService.prototype, "handleAbsenceDetection", null);
exports.AbsenceDetectionService = AbsenceDetectionService = AbsenceDetectionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AbsenceDetectionService);
//# sourceMappingURL=absence-detection.service.js.map