import { EncouragementNoteRepository } from '../infrastructure/repositories/encouragement-note.repository';
import { UserRepository } from '../../auth/infrastructure/repositories/user.repository';
export declare class CreateEncouragementNoteUseCase {
    private readonly noteRepo;
    private readonly userRepo;
    constructor(noteRepo: EncouragementNoteRepository, userRepo: UserRepository);
    execute(senderId: string, receiverId: string, content: string): Promise<import("../domain/encouragement-note.entity").EncouragementNoteEntity>;
}
