import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLogUseCase } from './application/create-log.usecase';
import { GetLogHistoryUseCase } from './application/get-log-history.usecase';
import { GetStatisticsUseCase } from './application/get-statistics.usecase';
import { CreateLogDto } from './infrastructure/dtos/create-log.dto';
import { LogFilterDto } from './infrastructure/dtos/log-filter.dto';

@Controller('tracking')
@UseGuards(JwtAuthGuard)
export class TrackingController {
  constructor(
    private readonly createLog: CreateLogUseCase,
    private readonly getHistory: GetLogHistoryUseCase,
    private readonly getStats: GetStatisticsUseCase,
  ) {}

  @Post('logs')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Request() req: any, @Body() dto: CreateLogDto) {
    return this.createLog.execute(req.user.userId, dto);
  }

  @Get('logs')
  history(
    @Request() req: any,
    @Query(new ValidationPipe({ transform: true })) filter: LogFilterDto,
    @Query('userId') requestedUserId?: string,
  ) {
    return this.getHistory.execute(req.user.userId, filter, requestedUserId);
  }

  @Get('statistics')
  statistics(@Request() req: any, @Query('userId') requestedUserId?: string) {
    return this.getStats.execute(req.user.userId, requestedUserId);
  }
}