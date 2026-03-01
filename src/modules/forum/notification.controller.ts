import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationRepository } from './infrastructure/repositories/notification.repository';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  @Get()
  getMyNotifications(@Request() req: any) {
    return this.notificationRepo.findByUserId(req.user.userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const count = await this.notificationRepo.countUnread(req.user.userId);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    await this.notificationRepo.markAsRead(id);
    return { message: 'Notificación marcada como leída' };
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req: any) {
    await this.notificationRepo.markAllAsRead(req.user.userId);
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }
}
