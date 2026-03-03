import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignSponsorDto {
  @IsNotEmpty({ message: 'El id del padrino es obligatorio' })
  @IsUUID('4', { message: 'El id del padrino debe ser un UUID válido' })
  sponsorId: string;

  @IsNotEmpty({ message: 'El id del ahijado es obligatorio' })
  @IsUUID('4', { message: 'El id del ahijado debe ser un UUID válido' })
  addictId: string;
}
