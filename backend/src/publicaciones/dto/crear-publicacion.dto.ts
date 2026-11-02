import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

const recortar = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CrearPublicacionDto {
  @Transform(recortar)
  @IsString()
  @Length(3, 100)
  titulo: string;

  @Transform(recortar)
  @IsString()
  @Length(1, 1000)
  mensaje: string;
}
