import { IsDateString, IsOptional } from 'class-validator';

export class LogFilterDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
