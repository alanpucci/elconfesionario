import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { UsuarioDocument } from '../../usuarios/esquemas/usuario.schema.js';
import { AuthService } from '../auth.service.js';

export type PeticionAutenticada = Request & { usuario: UsuarioDocument };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(contexto: ExecutionContext) {
    const peticion = contexto.switchToHttp().getRequest<PeticionAutenticada>();
    peticion.usuario = await this.authService.obtenerUsuarioDelToken(peticion);
    return true;
  }
}
