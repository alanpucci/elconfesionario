import { IsString, Length } from 'class-validator';

export class CrearPublicacionDto {
  @IsString()
  @Length(3, 100)
  titulo: string;

  @IsString()
  @Length(1, 1000)
  mensaje: string;
}
