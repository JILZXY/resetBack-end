import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DailyLogRepository } from '../infrastructure/repositories/daily-log.repository';
import { SponsorshipRepository } from '../../sponsorship/infrastructure/repositories/sponsorship.repository';
import { LogFilterDto } from '../infrastructure/dtos/log-filter.dto';

@Injectable()
export class GetLogHistoryUseCase {
  constructor(
    private readonly logRepo: DailyLogRepository,
    private readonly sponsorRepo: SponsorshipRepository,
  ) {}

  async execute(userId: string, filter: LogFilterDto, requestedUserId?: string) {
    const targetUserId = requestedUserId || userId;

    if (userId !== targetUserId) {
      const isActiveSponsor = await this.sponsorRepo.checkActiveSponsorship(userId, targetUserId);
      if (!isActiveSponsor) {
        throw new HttpException('No tienes permisos para ver el historial de este usuario', HttpStatus.FORBIDDEN);
      }
    }

    const from = filter.from ? new Date(filter.from) : undefined;
    const to = filter.to ? new Date(filter.to) : undefined;
    return this.logRepo.findHistory(targetUserId, from, to);
  }
}