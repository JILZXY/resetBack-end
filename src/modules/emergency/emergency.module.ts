import { Module } from '@nestjs/common';
import { EmergencyController } from './emergency.controller';
import { ContactRepository } from './infrastructure/repositories/contact.repository';
import { AlertRepository } from './infrastructure/repositories/alert.repository';
import { NotificationService } from './infrastructure/services/notification.service';
import { AddContactUseCase } from './application/add-contact.usecase';
import { TriggerAlertUseCase } from './application/trigger-alert.usecase';
import { NotifyContactsUseCase } from './application/notify-contacts.usecase';

@Module({
  controllers: [EmergencyController],
  providers: [
    ContactRepository,
    AlertRepository,
    NotificationService,
    AddContactUseCase,
    TriggerAlertUseCase,
    NotifyContactsUseCase,
  ],
  exports: [AlertRepository, NotificationService],
})
export class EmergencyModule {}
