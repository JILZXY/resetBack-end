import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class TriggerAlertDto {
  @IsOptional()
  @IsBoolean()
  resulted_in_relapse?: boolean;

  @IsOptional()
  @IsString()
  resolution_notes?: string;
}