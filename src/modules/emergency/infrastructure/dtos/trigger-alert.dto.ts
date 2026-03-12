import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class TriggerAlertDto {
  @IsOptional()
  @IsBoolean()
  resultedInRelapse?: boolean;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}
