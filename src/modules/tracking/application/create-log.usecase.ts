import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DailyLogRepository } from '../infrastructure/repositories/daily-log.repository';
import { CreateLogDto } from '../infrastructure/dtos/create-log.dto';

@Injectable()
export class CreateLogUseCase {
  constructor(
    private readonly logRepo: DailyLogRepository,
  ) { }

  async execute(userId: string, dto: CreateLogDto) {
    const logDate = new Date(dto.log_date);

    const existing = await this.logRepo.findByDate(userId, logDate);
    if (existing) {
      throw new HttpException(
        {
          code: 'LOG_ALREADY_EXISTS',
          message: 'Ya existe un registro para esta fecha',
          details: { log_date: dto.log_date },
        },
        HttpStatus.CONFLICT,
      );
    }

    const cl = await this.logRepo.findCravingLevelByValue(dto.craving_level);
    if (!cl) {
      throw new HttpException(
        {
          code: 'INVALID_CRAVING_LEVEL',
          message: 'Nivel de craving inválido',
          details: { craving_level: dto.craving_level },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const cravingLevelId = cl.id;

    const es = await this.logRepo.findEmotionalStateByValue(
      dto.emotional_state,
    );
    if (!es) {
      throw new HttpException(
        {
          code: 'INVALID_EMOTIONAL_STATE',
          message: 'Estado emocional inválido',
          details: { emotional_state: dto.emotional_state },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const emotionalStateId = es.id;

    const log = await this.logRepo.createWithStreakUpdate({
      userId,
      logDate,
      consumed: dto.consumed,
      cravingLevelId,
      emotionalStateId,
      cravingLevel: dto.craving_level,
      emotionalState: dto.emotional_state,
      triggers: dto.triggers,
      notes: dto.notes,
    });

    return log;
  }
}
