import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { PeticionAutenticada } from '../guards/jwt-auth.guard.js';

export const UsuarioActual = createParamDecorator(
  (_datos: unknown, contexto: ExecutionContext) =>
    contexto.switchToHttp().getRequest<PeticionAutenticada>().usuario,
);
