import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DailyLogRepository } from '../infrastructure/repositories/daily-log.repository';
import { CreateLogDto } from '../infrastructure/dtos/create-log.dto';
import { CreateStreakUseCase } from '../../streak/application/create-streak.usecase';

@Injectable()
export class CreateLogUseCase {
  constructor(
    private readonly logRepo: DailyLogRepository,
    private readonly createStreak: CreateStreakUseCase,
  ) {}

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

    // Resolver IDs de craving y estado emocional
    let cravingLevelId: string | undefined;
    let emotionalStateId: string | undefined;

    if (dto.craving_level) {
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
      cravingLevelId = cl.id;
    }

    if (dto.emotional_state) {
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
      emotionalStateId = es.id;
    }

    // Asegurar que exista una racha antes de insertar el log
    // (el trigger fn_update_streak reacciona al INSERT y actualiza la racha automáticamente)
    await this.createStreak.execute(userId);

    const log = await this.logRepo.create({
      userId,
      logDate,
      consumed: dto.consumed,
      cravingLevelId,
      emotionalStateId,
      triggers: dto.triggers,
      notes: dto.notes,
    });

    return log;
  }
}
