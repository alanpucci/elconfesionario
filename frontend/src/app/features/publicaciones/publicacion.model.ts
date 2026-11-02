export type OrdenPublicaciones = 'fecha' | 'meGusta';

export interface AutorPublicacion {
  _id: string;
  nombreUsuario: string;
  nombre: string;
  apellido: string;
  imagenPerfilUrl: string | null;
}

export interface Publicacion {
  _id: string;
  titulo: string;
  mensaje: string;
  imagenUrl: string | null;
  usuario: AutorPublicacion;
  cantidadMeGusta: number;
  meGustaDado: boolean;
  createdAt: string;
  updatedAt: string;
}
