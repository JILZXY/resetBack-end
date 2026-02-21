import { Injectable } from '@nestjs/common';
import { DailyLogRepository } from '../infrastructure/repositories/daily-log.repository';
import { LogFilterDto } from '../infrastructure/dtos/log-filter.dto';

@Injectable()
export class GetLogHistoryUseCase {
  constructor(private readonly logRepo: DailyLogRepository) {}

  async execute(userId: string, filter: LogFilterDto) {
    const from = filter.from ? new Date(filter.from) : undefined;
    const to = filter.to ? new Date(filter.to) : undefined;
    return this.logRepo.findHistory(userId, from, to);
  }
}