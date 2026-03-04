import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EncouragementNote, EncouragementNoteDocument } from '../../schemas/encouragement-note.schema';
import { EncouragementNoteEntity } from '../../domain/encouragement-note.entity';

@Injectable()
export class EncouragementNoteRepository {
  constructor(
    @InjectModel(EncouragementNote.name)
    private readonly noteModel: Model<EncouragementNoteDocument>,
  ) {}

  async create(data: {
    senderId: string;
    receiverId: string;
    content: string;
  }): Promise<EncouragementNoteEntity> {
    const created = await this.noteModel.create(data);
    return this.toEntity(created);
  }

  async findByReceiverId(receiverId: string): Promise<EncouragementNoteEntity[]> {
    const notes = await this.noteModel
      .find({ receiverId })
      .sort({ createdAt: -1 })
      .exec();
    return notes.map((n) => this.toEntity(n));
  }

  private toEntity(raw: EncouragementNoteDocument): EncouragementNoteEntity {
    const entity = new EncouragementNoteEntity();
    entity.id = (raw._id as any).toString();
    entity.senderId = raw.senderId;
    entity.receiverId = raw.receiverId;
    entity.content = raw.content;
    entity.createdAt = (raw as any).createdAt;
    return entity;
  }
}
