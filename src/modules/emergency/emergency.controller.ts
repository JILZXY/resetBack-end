import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TriggerAlertUseCase } from './application/trigger-alert.usecase';
import { TriggerAlertDto } from './infrastructure/dtos/trigger-alert.dto';

@Controller('emergency')
export class EmergencyController {
    return this.addContact.execute(req.user.userId, dto);
  }

  @Get('contacts')
  getContacts(@Request() req: any) {
    return this.contactRepo.findAllByUserId(req.user.userId);
  }

  @Delete('contacts/:id')
  async deleteContact(@Request() req: any, @Param('id') id: string) {
    const contact = await this.contactRepo.findById(id);

    if (!contact || contact.userId !== req.user.userId) {
      return { message: 'Contacto no encontrado' };
    }

    await this.contactRepo.deactivate(id);
    return { message: 'Contacto eliminado correctamente' };
  }

  @Post('alert')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  triggerEmergency(@Request() req: any, @Body() dto: TriggerAlertDto) {
    return this.triggerAlert.execute(req.user.userId, dto);
  }

  @Get('alerts')
  getAlerts(@Request() req: any) {
    return this.alertRepo.findAllByUserId(req.user.userId);
  }
}
