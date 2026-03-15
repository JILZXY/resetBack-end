import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RequestSponsorshipDto {
  @IsNotEmpty({ message: 'El código de padrino es obligatorio' })
  @IsString()
  @MaxLength(10)
  sponsor_code: string;
}
