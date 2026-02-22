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
  contact_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsOptional()
  @IsIn(['familia', 'amigo', 'padrino', 'terapeuta', 'otro'])
  relationship?: string;

  @IsOptional()
  @IsString()
  custom_relationship?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority_order?: number;
}