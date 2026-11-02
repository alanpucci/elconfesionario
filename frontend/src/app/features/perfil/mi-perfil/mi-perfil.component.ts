import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-mi-perfil',
  imports: [DatePipe, RouterLink],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
})
export class MiPerfilComponent {
  protected readonly authService = inject(AuthService);

  protected readonly publicacionesEjemplo = [
    { titulo: 'Nunca le dije a nadie', fecha: 'hace 2 horas', comentarios: ['Qué lindo gesto', 'Me pasó algo parecido'] },
    { titulo: 'Fingí que sabía de vinos', fecha: 'hace 3 días', comentarios: [] as string[] },
  ];
}
