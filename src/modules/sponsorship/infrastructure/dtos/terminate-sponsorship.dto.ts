import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TerminateSponsorshipDto {
  @IsNotEmpty({ message: 'La razón de terminación es obligatoria' })
  @IsString()
  @MaxLength(500)
  reason: string;
}
