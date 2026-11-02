import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { UsuarioDocument } from '../usuarios/esquemas/usuario.schema.js';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto.js';
import { Publicacion } from './esquemas/publicacion.schema.js';

const CARPETA_PUBLICACIONES = 'red-social/publicaciones';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<Publicacion>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async crear(
    dto: CrearPublicacionDto,
    usuario: UsuarioDocument,
    imagen?: Express.Multer.File,
  ) {
    const subida = imagen
      ? await this.cloudinaryService.subirImagen(
          imagen.buffer,
          CARPETA_PUBLICACIONES,
        )
      : null;

    try {
      const publicacion = await this.publicacionModel.create({
        titulo: dto.titulo,
        mensaje: dto.mensaje,
        imagenUrl: subida?.url ?? null,
        imagenPublicId: subida?.publicId ?? null,
        usuario: usuario._id,
      });

      const objeto: Partial<Publicacion> & { __v?: number } =
        publicacion.toObject();
      delete objeto.imagenPublicId;
      delete objeto.meGusta;
      delete objeto.__v;
      return { ...objeto, meGustaDado: false };
    } catch (error) {
      if (subida) {
        await this.cloudinaryService.eliminarImagen(subida.publicId);
      }
      throw error;
    }
  }
}
