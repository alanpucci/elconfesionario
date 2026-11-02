import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ModalService } from '../../../core/modal.service';
import { PaginadorComponent } from '../../../shared/paginador/paginador.component';
import { NuevaPublicacionComponent } from '../nueva-publicacion/nueva-publicacion.component';
import { PublicacionCardComponent } from '../publicacion-card/publicacion-card.component';
import { OrdenPublicaciones, Publicacion } from '../publicacion.model';
import { PublicacionesService } from '../publicaciones.service';

const POR_PAGINA = 10;

@Component({
  selector: 'app-publicaciones',
  imports: [NuevaPublicacionComponent, PublicacionCardComponent, PaginadorComponent],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css',
})
export class PublicacionesComponent implements OnInit {
  private readonly publicacionesService = inject(PublicacionesService);
  private readonly modalService = inject(ModalService);

  protected readonly porPagina = POR_PAGINA;
  protected readonly mostrandoFormulario = signal(false);
  protected readonly cargando = signal(false);
  protected readonly publicaciones = signal<Publicacion[]>([]);
  protected readonly total = signal(0);
  protected readonly offset = signal(0);
  protected readonly orden = signal<OrdenPublicaciones>('fecha');

  ngOnInit() {
    this.cargar();
  }

  protected cambiarOrden(evento: Event) {
    this.orden.set((evento.target as HTMLSelectElement).value as OrdenPublicaciones);
    this.cargar(0);
  }

  protected publicada() {
    this.mostrandoFormulario.set(false);
    this.cargar(0);
  }

  protected async cargar(offset = this.offset()) {
    this.cargando.set(true);
    try {
      const pagina = await this.publicacionesService.listar(this.orden(), offset, POR_PAGINA);
      this.publicaciones.set(pagina.datos);
      this.total.set(pagina.total);
      this.offset.set(pagina.offset);
    } catch (error) {
      if ((error as HttpErrorResponse).status !== 401) {
        this.modalService.mostrarError('No pudimos cargar las confesiones');
      }
    }
    this.cargando.set(false);
  }
}
