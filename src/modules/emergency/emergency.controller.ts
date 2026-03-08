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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddContactUseCase } from './application/add-contact.usecase';
import { TriggerAlertUseCase } from './application/trigger-alert.usecase';
import { ContactRepository } from './infrastructure/repositories/contact.repository';
import { AlertRepository } from './infrastructure/repositories/alert.repository';
import { CreateContactDto } from './infrastructure/dtos/create-contact.dto';
import { TriggerAlertDto } from './infrastructure/dtos/trigger-alert.dto';

@Controller('emergency')
@UseGuards(JwtAuthGuard)
export class EmergencyController {
  constructor(
    private readonly addContact: AddContactUseCase,
    private readonly triggerAlert: TriggerAlertUseCase,
    private readonly contactRepo: ContactRepository,
    private readonly alertRepo: AlertRepository,
  ) {}

  @Post('contacts')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createContact(@Request() req: any, @Body() dto: CreateContactDto) {
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
