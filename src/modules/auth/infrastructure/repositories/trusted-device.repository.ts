import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class TrustedDeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, deviceIdentifier: string, deviceName?: string) {
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

  async findValidDevice(userId: string, deviceIdentifier: string) {
    return this.prisma.trustedDevice.findFirst({
      where: {
        user_id: userId,
        device_identifier: deviceIdentifier,
        expires_at: { gt: new Date() },
      },
    });
  }

  async updateLastUsed(id: string) {
    await this.prisma.trustedDevice.update({
      where: { id },
      data: { last_used_at: new Date() },
    });
  }

  async delete(deviceIdentifier: string) {
    await this.prisma.trustedDevice.delete({
      where: { device_identifier: deviceIdentifier },
    });
  }
}
