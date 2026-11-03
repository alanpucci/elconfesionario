import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Usuario } from '../features/usuarios/usuario.model';
import { CredencialesLogin, RespuestaAuth } from './auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  readonly usuarioActual = signal<Usuario | null>(null);

  registrar(formData: FormData) {
    return this.http.post<RespuestaAuth>(`${environment.apiUrl}/auth/registro`, formData);
  }

  login(credenciales: CredencialesLogin) {
    return this.http.post<RespuestaAuth>(`${environment.apiUrl}/auth/login`, credenciales);
  }

  cerrarSesion() {
    this.tokenService.borrar();
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }

  iniciarSesion(respuesta: RespuestaAuth) {
    this.tokenService.guardar(respuesta.token);
    this.usuarioActual.set(respuesta.usuario);
  }
}
