import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UsuarioDocument } from '../../usuarios/esquemas/usuario.schema.js';
import { UsuariosService } from '../../usuarios/usuarios.service.js';
import { JwtPayload } from '../interfaces/jwt-payload.interface.js';

export type PeticionAutenticada = Request & { usuario: UsuarioDocument };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async canActivate(contexto: ExecutionContext) {
    const peticion = contexto.switchToHttp().getRequest<PeticionAutenticada>();
    const [tipo, token] = peticion.headers.authorization?.split(' ') ?? [];

    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException('Sesión no válida');
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Sesión no válida');
    }

    const usuario = await this.usuariosService.buscarPorId(payload.id);
    if (!usuario) {
      throw new UnauthorizedException('Sesión no válida');
    }
    if (!usuario.habilitado) {
      throw new ForbiddenException('Tu usuario está deshabilitado');
    }

    peticion.usuario = usuario;
    return true;
  }
}
