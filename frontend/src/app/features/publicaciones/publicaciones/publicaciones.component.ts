import { Component } from '@angular/core';

interface PublicacionEjemplo {
  autor: string;
  fecha: string;
  titulo: string;
  mensaje: string;
  meGusta: number;
}

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css',
})
export class PublicacionesComponent {
  protected readonly publicaciones: PublicacionEjemplo[] = [
    {
      autor: 'ana.g',
      fecha: 'hace 2 horas',
      titulo: 'Nunca le dije a nadie',
      mensaje: 'Hoy en el colectivo le devolví la billetera a un señor y me quedé pensando en lo bien que se siente hacer algo bueno sin que nadie lo sepa.',
      meGusta: 12,
    },
    {
      autor: 'lucas.m',
      fecha: 'hace 1 día',
      titulo: 'Me comí el último alfajor',
      mensaje: 'Culpé al perro. El perro no tiene manera de defenderse y yo no tengo remordimientos.',
      meGusta: 31,
    },
    {
      autor: 'sofi_92',
      fecha: 'hace 3 días',
      titulo: 'Fingí que sabía de vinos',
      mensaje: 'En la cena de la oficina elogié un tinto por su «cuerpo y estructura». Era jugo de uva.',
      meGusta: 8,
    },
  ];
}
