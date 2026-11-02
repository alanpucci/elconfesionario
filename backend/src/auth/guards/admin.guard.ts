import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PeticionAutenticada } from './jwt-auth.guard.js';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(contexto: ExecutionContext) {
    const { usuario } = contexto
      .switchToHttp()
      .getRequest<PeticionAutenticada>();

    if (usuario?.perfil !== 'administrador') {
      throw new ForbiddenException('No tenés permisos para esta acción');
    }
    return true;
  }
}
