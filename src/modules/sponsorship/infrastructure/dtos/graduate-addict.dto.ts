import { IsNotEmpty, IsString } from 'class-validator';

export class GraduateAddictDto {
  @IsNotEmpty()
  @IsString()
  addictId: string;
}
