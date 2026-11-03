import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../core/modal.service';
import { PublicacionesService } from '../publicaciones.service';

const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANO_MAXIMO = 2 * 1024 * 1024;

@Component({
  selector: 'app-nueva-publicacion',
  imports: [ReactiveFormsModule],
  templateUrl: './nueva-publicacion.component.html',
  styleUrl: './nueva-publicacion.component.css',
})
export class NuevaPublicacionComponent {
  private readonly publicacionesService = inject(PublicacionesService);
  private readonly modalService = inject(ModalService);

  readonly publicada = output<void>();
  readonly cancelada = output<void>();

  protected readonly cargando = signal(false);
  protected readonly imagen = signal<File | null>(null);
  protected readonly vistaPrevia = signal<string | null>(null);
  protected readonly errorImagen = signal('');

  protected readonly formulario = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    mensaje: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
  });

  protected longitud(campo: 'titulo' | 'mensaje') {
    return this.formulario.controls[campo].value?.length ?? 0;
  }

  protected mensajeError(campo: 'titulo' | 'mensaje') {
    const control = this.formulario.controls[campo];
    if (!control.touched) {
      return '';
    }
    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control.hasError('minlength')) {
      return `Debe tener al menos ${control.getError('minlength').requiredLength} caracteres`;
    }
    if (control.hasError('maxlength')) {
      return `No puede superar los ${control.getError('maxlength').requiredLength} caracteres`;
    }
    return '';
  }

  protected seleccionarImagen(evento: Event) {
    const archivo = (evento.target as HTMLInputElement).files?.[0] ?? null;
    this.errorImagen.set('');
    this.imagen.set(null);
    this.vistaPrevia.set(null);

    if (!archivo) {
      return;
    }
    if (!TIPOS_IMAGEN.includes(archivo.type)) {
      this.errorImagen.set('La imagen debe ser JPG, PNG o WEBP');
      return;
    }
    if (archivo.size > TAMANO_MAXIMO) {
      this.errorImagen.set('La imagen no puede superar los 2 MB');
      return;
    }

    this.imagen.set(archivo);
    const lector = new FileReader();
    lector.onload = () => this.vistaPrevia.set(lector.result as string);
    lector.readAsDataURL(archivo);
  }

  protected enviar() {
    if (this.formulario.invalid || this.errorImagen()) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { titulo, mensaje } = this.formulario.value;
    const formData = new FormData();
    formData.append('titulo', titulo ?? '');
    formData.append('mensaje', mensaje ?? '');
    const imagen = this.imagen();
    if (imagen) {
      formData.append('imagen', imagen);
    }

    this.cargando.set(true);
    this.publicacionesService.crear(formData).subscribe({
      next: () => {
        this.cargando.set(false);
        this.publicada.emit();
        this.modalService.mostrarInfo('Tu confesión fue publicada.');
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.modalService.mostrarError(this.mensajeDe(error));
      },
    });
  }

  private mensajeDe(error: HttpErrorResponse) {
    const mensaje = error.error?.message;
    if (Array.isArray(mensaje)) {
      return mensaje.join('. ');
    }
    return mensaje ?? 'No pudimos conectar con el servidor';
  }
}
