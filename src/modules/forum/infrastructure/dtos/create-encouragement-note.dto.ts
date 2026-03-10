import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateEncouragementNoteDto {
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
