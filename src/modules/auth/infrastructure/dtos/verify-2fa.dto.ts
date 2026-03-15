import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class Verify2FADto {
  @IsNotEmpty()
  @IsString()
  mfaToken: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
  code: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
