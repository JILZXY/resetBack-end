import { Model } from 'mongoose';
import { EncouragementNoteDocument } from '../../schemas/encouragement-note.schema';
import { EncouragementNoteEntity } from '../../domain/encouragement-note.entity';
export declare class EncouragementNoteRepository {
    private readonly noteModel;
    constructor(noteModel: Model<EncouragementNoteDocument>);
    create(data: {
        senderId: string;
        receiverId: string;
        content: string;
    }): Promise<EncouragementNoteEntity>;
    findByReceiverId(receiverId: string): Promise<EncouragementNoteEntity[]>;
    private toEntity;
}
