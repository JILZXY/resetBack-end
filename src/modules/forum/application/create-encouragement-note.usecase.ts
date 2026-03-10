import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EncouragementNoteRepository } from '../infrastructure/repositories/encouragement-note.repository';
import { UserRepository } from '../../auth/infrastructure/repositories/user.repository';

@Injectable()
export class CreateEncouragementNoteUseCase {
  constructor(
    private readonly noteRepo: EncouragementNoteRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(senderId: string, receiverId: string, content: string) {
    // Validar que el receptor existe
    const receiver = await this.userRepo.findById(receiverId);
    if (!receiver) {
      throw new HttpException(
        {
          code: 'RECEIVER_NOT_FOUND',
          message: 'El destinatario no existe',
          details: { receiverId },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // El remitente debe ser PADRINO (opcional, según lógica de negocio)
    // Pero aquí asumimos que el controlador ya filtra o que cualquiera puede enviar aliento si es sponsor.

    const note = await this.noteRepo.create({
      senderId,
      receiverId,
      content,
    });

    return note;
  }
}
