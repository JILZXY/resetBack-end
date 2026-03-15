import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class BecomeAddictDto {
  @IsNotEmpty()
  @IsString()
  addictionName: string;

  @IsOptional()
  @IsString()
  classification?: string;
}
