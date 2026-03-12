import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateLogDto {
  @IsDateString(
    {},
    { message: 'log_date debe ser una fecha válida (YYYY-MM-DD)' },
  )
  @IsNotEmpty()
  log_date: string;

  @IsBoolean({ message: 'consumed debe ser true o false' })
  consumed: boolean;

  @IsInt()
  @Min(1)
  @Max(10)
  craving_level: number;

  @IsInt()
  @Min(1)
  @Max(10)
  emotional_state: number;

  @IsOptional()
  @IsString()
  triggers?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
