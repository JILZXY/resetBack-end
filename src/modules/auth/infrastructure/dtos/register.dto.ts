import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @MaxLength(150)
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsOptional()
  @IsIn(['ADICTO', 'PADRINO'], { message: 'El rol debe ser ADICTO o PADRINO' })
  role?: string;

  @ValidateIf((o) => o.role === 'ADICTO' || !o.role)
  @IsNotEmpty({
    message: 'El nombre de la adicción es obligatorio para pacientes',
  })
  @IsString()
  @MaxLength(100)
  addictionName?: string;

  @ValidateIf((o) => o.role === 'ADICTO' || !o.role)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  classification?: string;
}
