import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Publicacion } from './publicacion.model';

@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private readonly http = inject(HttpClient);

  crear(formData: FormData) {
    return firstValueFrom(this.http.post<Publicacion>(`${environment.apiUrl}/publicaciones`, formData));
  }
}
