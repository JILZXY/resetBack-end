import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class AbsenceDetectionService {
  private readonly logger = new Logger(AbsenceDetectionService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 3 * * *')
  async handleAbsenceDetection() {
    this.logger.log('Ejecutando detección de ausencias...');
    try {
      await this.prisma.$queryRawUnsafe('SELECT tracking.fn_detect_absence()');
      this.logger.log('Detección de ausencias completada exitosamente');
    } catch (error) {
      this.logger.error('Error en detección de ausencias:', error);
    }
  }
}
