import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsNotEmpty({ message: 'La opción de recordar dispositivo es necesaria' })
  rememberMe?: boolean;
}
