import { Component, input } from '@angular/core';
import { TiempoRelativoPipe } from '../../../shared/pipes/tiempo-relativo.pipe';
import { Publicacion } from '../publicacion.model';

@Component({
  selector: 'app-publicacion-card',
  imports: [TiempoRelativoPipe],
  templateUrl: './publicacion-card.component.html',
  styleUrl: './publicacion-card.component.css',
})
export class PublicacionCardComponent {
  readonly publicacion = input<Publicacion | null>(null);
}
