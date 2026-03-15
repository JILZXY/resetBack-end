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
exports.TrustedDeviceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/database/prisma/prisma.service");
let TrustedDeviceRepository = class TrustedDeviceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, deviceIdentifier, deviceName) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        return this.prisma.trustedDevice.create({
            data: {
                user_id: userId,
                device_identifier: deviceIdentifier,
                device_name: deviceName,
                expires_at: expiresAt,
            },
        });
    }
    async findValidDevice(userId, deviceIdentifier) {
        return this.prisma.trustedDevice.findFirst({
            where: {
                user_id: userId,
                device_identifier: deviceIdentifier,
                expires_at: { gt: new Date() },
            },
        });
    }
    async updateLastUsed(id) {
        await this.prisma.trustedDevice.update({
            where: { id },
            data: { last_used_at: new Date() },
        });
    }
    async delete(deviceIdentifier) {
        await this.prisma.trustedDevice.delete({
            where: { device_identifier: deviceIdentifier },
        });
    }
};
exports.TrustedDeviceRepository = TrustedDeviceRepository;
exports.TrustedDeviceRepository = TrustedDeviceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TrustedDeviceRepository);
//# sourceMappingURL=trusted-device.repository.js.map