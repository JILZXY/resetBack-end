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

  async execute(
    userId: string,
    filter: LogFilterDto,
    requestedUserId?: string,
  ) {
    const targetUserId = requestedUserId || userId;

    if (userId !== targetUserId) {
      const isActiveSponsor = await this.sponsorRepo.checkActiveSponsorship(
        userId,
        targetUserId,
      );
      if (!isActiveSponsor) {
        throw new HttpException(
          'No tienes permisos para ver el historial de este usuario',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    let from: Date | undefined = filter.from ? new Date(filter.from) : undefined;
    let to: Date | undefined = filter.to ? new Date(filter.to) : undefined;

    if (filter.year) {
      const year = filter.year;
      const month = filter.month ? filter.month - 1 : 0;
      const day = filter.day ? filter.day : 1;

      if (filter.day && filter.month) {
        from = new Date(year, month, day, 0, 0, 0, 0);
        to = new Date(year, month, day, 23, 59, 59, 999);
      } else if (filter.month) {
        from = new Date(year, month, 1, 0, 0, 0, 0);
        to = new Date(year, month + 1, 0, 23, 59, 59, 999);
      } else {
        from = new Date(year, 0, 1, 0, 0, 0, 0);
        to = new Date(year, 11, 31, 23, 59, 59, 999);
      }
    }

    return this.logRepo.findHistory(targetUserId, from, to);
  }
}
