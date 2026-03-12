import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsOptional()
  @IsBoolean({ message: 'La opción de recordar dispositivo debe ser un valor booleano' })
  rememberMe?: boolean;
}
