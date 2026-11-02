import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(valor: string) {
    if (!isValidObjectId(valor)) {
      throw new BadRequestException('El identificador no es válido');
    }
    return valor;
  }
}
