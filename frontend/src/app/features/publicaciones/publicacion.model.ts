export interface Publicacion {
  _id: string;
  titulo: string;
  mensaje: string;
  imagenUrl: string | null;
  usuario: string;
  cantidadMeGusta: number;
  meGustaDado: boolean;
  activa: boolean;
  createdAt: string;
  updatedAt: string;
}
