import {
  Body,
  Controller,
  Get,
  Post,
  Query,
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
import { ListarPublicacionesQueryDto } from './dto/listar-publicaciones-query.dto.js';
import { PublicacionesService } from './publicaciones.service.js';

@Controller('publicaciones')
@UseGuards(JwtAuthGuard)
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Get()
  listar(
    @Query() query: ListarPublicacionesQueryDto,
    @UsuarioActual() usuario: UsuarioDocument,
  ) {
    return this.publicacionesService.listar(query, usuario);
  }

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
