import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { crearPipeImagen } from '../comun/validadores/imagen.validator.js';
import type { UsuarioDocument } from '../usuarios/esquemas/usuario.schema.js';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto.js';
import { PublicacionesService } from './publicaciones.service.js';

@Controller('publicaciones')
@UseGuards(JwtAuthGuard)
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
  crear(
    @Body() dto: CrearPublicacionDto,
    @UsuarioActual() usuario: UsuarioDocument,
    @UploadedFile(crearPipeImagen()) imagen?: Express.Multer.File,
  ) {
    return this.publicacionesService.crear(dto, usuario, imagen);
  }
}
