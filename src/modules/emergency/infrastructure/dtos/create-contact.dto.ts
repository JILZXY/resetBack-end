import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  contactName: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsOptional()
  @IsIn(['familia', 'amigo', 'padrino', 'terapeuta', 'otro'])
  relationship?: string;

  @IsOptional()
  @IsString()
  customRelationship?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priorityOrder?: number;
}
