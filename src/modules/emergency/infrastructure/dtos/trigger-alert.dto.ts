import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class TriggerAlertDto {
  @IsOptional()
  @IsBoolean()
  resultedInRelapse?: boolean;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}
