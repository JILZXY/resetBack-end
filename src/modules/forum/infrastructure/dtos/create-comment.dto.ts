import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsBoolean()
  is_anonymous: boolean;

  @IsOptional()
  @IsMongoId({ message: 'parent_id debe ser un ObjectId válido' })
  parent_id?: string;
}
