import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class AbsenceDetectionService {
  private readonly logger = new Logger(AbsenceDetectionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Se ejecuta todos los días a las 3:00 AM.
   * Invoca la función tracking.fn_detect_absence() que:
   * - Detecta usuarios con rachas activas que no han registrado un log
   * - Inserta registros en tracking.log_absences
   * - Pausa rachas si la ausencia supera 48 horas
   */
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
