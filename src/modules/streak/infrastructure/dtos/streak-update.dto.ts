import { IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';

export class StreakUpdateDto {
  @IsBoolean()
  consumed: boolean;

  @IsDateString()
  @IsNotEmpty()
  log_date: string;
}
