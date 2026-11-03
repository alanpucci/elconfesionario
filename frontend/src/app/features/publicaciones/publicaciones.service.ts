import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Paginado } from '../../core/paginado.model';
import { OrdenPublicaciones, Publicacion } from './publicacion.model';

@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private readonly http = inject(HttpClient);

  crear(formData: FormData) {
    return this.http.post(`${environment.apiUrl}/publicaciones`, formData);
  }

  listar(orden: OrdenPublicaciones, offset: number, limit: number, usuarioId = '') {
    let params = new HttpParams().set('orden', orden).set('offset', offset).set('limit', limit);
    if (usuarioId) {
      params = params.set('usuarioId', usuarioId);
    }
    return this.http.get<Paginado<Publicacion>>(`${environment.apiUrl}/publicaciones`, { params });
  }
}
