# Sprint 2 — Tareas

Objetivo: publicar confesiones con imagen opcional, listarlas paginadas con orden por fecha o me gusta, dar y quitar me gusta, eliminar las propias y ver Mi Perfil con datos, foto y últimas 3 publicaciones.
Referencias: Doc 1 = `1_analisis_funcional.md` · Doc 2 = `2_modelo_de_datos_mongodb.md` · Doc 3 = `3_roadmap_por_sprints.md` (sección 4).

Estados: `[ ]` pendiente · `[~]` implementada, esperando validación · `[x]` validada.
Cada tarea se valida antes de pasar a la siguiente. Orden: primero el back (se prueba con Thunder Client/Postman), después el front.

Ya resuelto en S1 y que no se rehace: JWT en login/registro, `CloudinaryService`, `ModalService`, `TokenService`, interceptor que agrega `Authorization: Bearer` y cierra sesión ante 401 (`core/token.interceptor.ts`).

---

## Back

### [~] S2-01 · Back: autenticación de las rutas (JwtAuthGuard, @UsuarioActual, AdminGuard)
- **Qué:** `JwtAuthGuard` (verifica el token, carga el usuario, 401 si falta/está mal/vencido, chequea `habilitado`), decorador `@UsuarioActual()`, `AdminGuard` (perfil «administrador»). `AuthModule` los exporta junto con `JwtModule`.
- **Concepto clave:** guards y decoradores de parámetro en Nest; por qué el usuario sale del token y no del body.
- **Docs:** Doc 3 §2 y §4.3 · Doc 1 RN-07, RN-10.
- **Validar:** ruta temporal protegida: sin token → 401, token alterado → 401, token válido → 200 con el usuario (la ruta se borra al terminar).
- **Depende de:** S1-05

### [~] S2-02 · Back: esquemas Publicacion y Comentario, ParseObjectIdPipe
- **Qué:** `publicacion.schema.ts` con sus 4 índices, `comentario.schema.ts` (sin endpoints), `PublicacionesModule` con ambos registrados, `ParseObjectIdPipe` (400 si el `:id` es inválido).
- **Concepto clave:** referencias entre colecciones, `meGusta` como arreglo de ids con `cantidadMeGusta` desnormalizado.
- **Docs:** Doc 2 §5 y §6 · Doc 3 §4.3, §4.5.
- **Validar:** al arrancar aparecen las colecciones y los índices en Atlas.
- **Depende de:** S2-01

### [~] S2-03 · Back: crear publicación — POST /publicaciones (E-05)
- **Qué:** `CrearPublicacionDto`, `FileInterceptor('imagen')` con el validador de imagen existente, subida a `red-social/publicaciones` (se elimina la imagen si falla el guardado), usuario tomado del token, responde 201.
- **Concepto clave:** reutilizar `CloudinaryService` con carpeta por parámetro.
- **Docs:** Doc 1 E-05, RF-16 · Doc 3 §4.3.
- **Validar:** con imagen y sin imagen → 201 y documento en Atlas; imagen de 3 MB o `.gif` → 400; sin token → 401.
- **Depende de:** S2-02

### [ ] S2-04 · Back: listado — GET /publicaciones (E-06)
- **Qué:** `ListarPublicacionesQueryDto` (orden, usuarioId, offset, limit, comentarios con `@Type`, `@Min`, `@Max`) y `PublicacionesService.listar` con el pipeline del Doc 2 §7.1–7.3: solo activas, orden por fecha o `cantidadMeGusta` (empate por fecha), `meGustaDado`, autor sin datos sensibles, comentarios opcionales. Responde `{ datos, total, offset, limit }`.
- **Concepto clave:** aggregation con `$facet`/`$lookup` y paginación por offset.
- **Docs:** Doc 2 §7.1, §7.2, §7.3 · Doc 1 E-06, RF-17, RF-18, RF-20.
- **Validar:** con 25 publicaciones, offset 0/10/20 devuelve 10/10/5; `orden=meGusta` ordena bien; `usuarioId` filtra; `meGustaDado` refleja al usuario del token.
- **Depende de:** S2-03

### [ ] S2-05 · Back: me gusta — POST y DELETE /publicaciones/:id/me-gusta (E-09, E-10)
- **Qué:** updates atómicos condicionales (Doc 2 §7.4). POST: 201 `{ cantidadMeGusta, meGustaDado: true }`, 409 si ya existía. DELETE: 200 con `meGustaDado: false`, 404 si no había me gusta o la publicación no existe.
- **Concepto clave:** atomicidad con `findOneAndUpdate` y filtros condicionales para evitar contadores desfasados.
- **Docs:** Doc 2 §7.4 · Doc 1 E-09, E-10, RF-21, RF-22, S-13.
- **Validar:** me gusta dos veces → 201 y 409 con el contador subiendo 1; quitar uno no dado → 404.
- **Depende de:** S2-04

### [ ] S2-06 · Back: baja — DELETE /publicaciones/:id (E-08)
- **Qué:** autor o administrador (`activa = false`), 403 si no es ninguno, 404 si no existe o ya está dada de baja, 200 `{ mensaje }`.
- **Concepto clave:** baja lógica y autorización por propiedad del recurso.
- **Docs:** Doc 2 §7.5 · Doc 1 E-08, RF-23, RF-25.
- **Validar:** ajena con perfil usuario → 403; propia → 200, desaparece del listado y en Atlas queda `activa: false`.
- **Depende de:** S2-04

---

## Front

### [ ] S2-07 · Front: modelos, PublicacionesService y pipes/directiva base
- **Qué:** modelos `Publicacion`, `Comentario` y `Paginado<T>`; `PublicacionesService` (`crear`, `listar`, `eliminar`, `darMeGusta`, `quitarMeGusta`); pipes `tiempoRelativo` y `truncar`; directiva `appImagenRespaldo`.
- **Concepto clave:** servicios async con `firstValueFrom` y tipos genéricos.
- **Docs:** Doc 3 §4.2 · Doc 1 §7.
- **Validar:** compila; se ejercita en S2-08 a S2-11.
- **Depende de:** S2-04

### [ ] S2-08 · Front: listado, tarjeta y paginador
- **Qué:** `PublicacionCardComponent` (`input()`/`output()` con default), `PaginadorComponent` («Página X de N», 10 por página), `PublicacionesComponent` con selector de orden y estado vacío.
- **Concepto clave:** componentes presentacionales y paginación contra el back.
- **Docs:** Doc 1 CU de listado, RF-17, RF-18, RF-20, S-10.
- **Validar:** con 25 publicaciones, la página 1 muestra 10 y la 3 muestra 5; el orden cambia el listado.
- **Depende de:** S2-07

### [ ] S2-09 · Front: nueva publicación
- **Qué:** `NuevaPublicacionComponent` (título, mensaje, imagen con vista previa) en modal o panel; `FormData` a E-05; errores 400 en modal; recarga del listado al publicar.
- **Concepto clave:** reutilizar el patrón de `FormData` con archivo del registro.
- **Docs:** Doc 1 E-05, RF-16.
- **Validar:** publicar con y sin imagen; imagen de 3 MB o `.gif` → modal de error.
- **Depende de:** S2-08

### [ ] S2-10 · Front: me gusta y eliminar
- **Qué:** botón que alterna E-09/E-10 según `meGustaDado` y actualiza `cantidadMeGusta` con la respuesta; «Eliminar» visible solo si el autor es el usuario logueado, con confirmación por `ModalService`.
- **Concepto clave:** actualizar el estado local con la respuesta del back.
- **Docs:** Doc 1 RF-21 a RF-23.
- **Validar:** el contador sube y baja; ajena sin botón eliminar; propia desaparece del listado.
- **Depende de:** S2-08

### [ ] S2-11 · Front: Mi Perfil con datos reales
- **Qué:** `MiPerfilComponent` con datos de `usuarioActual` y E-06 con `usuarioId`, `limit = 3`, `comentarios = 3`; sección de comentarios vacía hasta S3.
- **Concepto clave:** reutilizar `PublicacionCardComponent` en otra pantalla.
- **Docs:** Doc 1 RF-29, RF-30, S-09, S-12.
- **Validar:** se ven todos los datos, la foto y las últimas 3 confesiones propias.
- **Depende de:** S2-08

### [ ] S2-12 · Front: errorInterceptor y guards (desactivados)
- **Qué:** separar el manejo de errores HTTP del interceptor de token (401 → login; 403 deshabilitado) y escribir `authGuard`, `adminGuard` e `invitadoGuard` sin activarlos en las rutas.
- **Concepto clave:** interceptores funcionales y guards funcionales.
- **Docs:** Doc 3 §2 · Doc 1 RN-07, RN-10.
- **Validar:** compila; la navegación sigue libre.
- **Depende de:** S2-07

---

## Cierre del sprint

### [ ] S2-13 · Deploy y verificación del sprint
- **Qué:** redeploy de back y front; recorrer los criterios de aceptación (Doc 3 §4.6) y la definición de terminado (Doc 3 §1.1) sobre la URL pública; etiquetar `sprint-2`.
- **Validar:** todos los ítems tildados; búsqueda de `alert(` sin resultados.
- **Depende de:** S2-06, S2-11, S2-12
