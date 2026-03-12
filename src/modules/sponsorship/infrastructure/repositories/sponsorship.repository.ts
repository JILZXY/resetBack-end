import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { SponsorshipEntity } from '../../domain/sponsorship.entity';

@Injectable()
export class SponsorshipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(
    sponsorId: string,
    addictId: string,
  ): Promise<SponsorshipEntity> {
    const sponsorship = await this.prisma.sponsorship.create({
      data: {
        sponsor_id: sponsorId,
        addict_id: addictId,
        status: 'PENDING',
      },
    });
    return this.toEntity(sponsorship);
  }

  async accept(id: string): Promise<SponsorshipEntity> {
    const sponsorship = await this.prisma.sponsorship.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        started_at: new Date(),
      },
    });
    return this.toEntity(sponsorship);
  }

  async reject(id: string): Promise<void> {
    await this.prisma.sponsorship.delete({ where: { id } });
  }

  async setInactive(id: string, reason: string): Promise<SponsorshipEntity> {
    const sponsorship = await this.prisma.sponsorship.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        ended_at: new Date(),
        termination_reason: reason,
      },
    });
    return this.toEntity(sponsorship);
  }

  async findActiveByAddictId(
    addictId: string,
  ): Promise<SponsorshipEntity | null> {
    const sponsorship = await this.prisma.sponsorship.findFirst({
      where: {
        addict_id: addictId,
        status: 'ACTIVE',
      },
    });
    return sponsorship ? this.toEntity(sponsorship) : null;
  }

  async findActiveBySponsorId(
    sponsorId: string,
  ): Promise<SponsorshipEntity | null> {
    const sponsorship = await this.prisma.sponsorship.findFirst({
      where: {
        sponsor_id: sponsorId,
        status: 'ACTIVE',
      },
    });
    return sponsorship ? this.toEntity(sponsorship) : null;
  }

  async findPendingByAddictId(
    addictId: string,
  ): Promise<SponsorshipEntity | null> {
    const sponsorship = await this.prisma.sponsorship.findFirst({
      where: {
        addict_id: addictId,
        status: 'PENDING',
      },
    });
    return sponsorship ? this.toEntity(sponsorship) : null;
  }

  async findPendingBySponsorId(
    sponsorId: string,
  ): Promise<SponsorshipEntity | null> {
    const sponsorship = await this.prisma.sponsorship.findFirst({
      where: {
        sponsor_id: sponsorId,
        status: 'PENDING',
      },
    });
    return sponsorship ? this.toEntity(sponsorship) : null;
  }

  async findById(id: string): Promise<SponsorshipEntity | null> {
    const sponsorship = await this.prisma.sponsorship.findUnique({
      where: { id },
    });
    return sponsorship ? this.toEntity(sponsorship) : null;
  }

  async checkActiveSponsorship(
    sponsorId: string,
    addictId: string,
  ): Promise<boolean> {
    const count = await this.prisma.sponsorship.count({
      where: {
        sponsor_id: sponsorId,
        addict_id: addictId,
        status: 'ACTIVE',
      },
    });
    return count > 0;
  }

  private toEntity(raw: any): SponsorshipEntity {
    const entity = new SponsorshipEntity();
    entity.id = raw.id;
    entity.sponsorId = raw.sponsor_id;
    entity.addictId = raw.addict_id;
    entity.startedAt = raw.started_at;
    entity.endedAt = raw.ended_at;
    entity.status = raw.status;
    entity.terminationReason = raw.termination_reason;
    entity.createdAt = raw.created_at;
    return entity;
  }
}
