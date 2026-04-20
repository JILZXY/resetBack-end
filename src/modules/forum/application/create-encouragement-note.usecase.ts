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

    const note = await this.noteRepo.create({
      senderId,
      receiverId,
      content,
    });

    return note;
  }
}
