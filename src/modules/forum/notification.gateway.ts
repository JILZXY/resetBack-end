import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotificationEntity } from './domain/notification.entity';

@WebSocketGateway({
  namespace: '/notifications',
  cors: { origin: '*', credentials: true },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const secret =
        this.configService.get<string>('JWT_SECRET') ||
        this.configService.get<string>('jwt.secret') || '';

      const payload = this.jwtService.verify(token, { secret });

      // Unir al cliente a su sala personal
      const room = `user:${payload.sub}`;
      client.join(room);
      client.data.userId = payload.sub;

      console.log(`[WS] Usuario ${payload.sub} conectado al namespace /notifications`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      console.log(`[WS] Usuario ${client.data.userId} desconectado`);
    }
  }

  /**
   * Envía una notificación en tiempo real a un usuario específico.
   * Los use cases invocan este método después de crear la notificación en DB.
   */
  sendToUser(userId: string, notification: NotificationEntity): void {
    this.server.to(`user:${userId}`).emit('new_notification', notification);
  }
}
