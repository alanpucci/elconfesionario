## Reglas de Angular

### Idioma del código
- Todo el código va en español: componentes, servicios, clases, métodos,
  variables, inputs/outputs, signals, segmentos de rutas (URLs), y nombres de
  archivos y carpetas de dominio.
- Se mantiene en inglés:
  - La API y las palabras reservadas de Angular, TypeScript y RxJS
    (`Component`, `Injectable`, `OnInit`, `Observable`, `signal`, etc.).
  - Los sufijos de convención (`*.routes.ts`, `*.service.ts`, `*.module.ts`).
  - Las carpetas técnicas estándar: `core/`, `shared/`, `features/`,
    `layout/`, `src/`, `assets/`, `environments/`.
- Cualquier otra excepción se menciona y se explica, no se asume.

### Comentarios
- No dejar comentarios en ningún archivo (`.ts`, `.html`, `.scss`, etc.),
  ni siquiera para explicar el porqué de una decisión.
- Esa explicación va en el mensaje de commit, en la descripción del PR o en
  README/CHANGELOG si es una decisión de arquitectura.

### Componentes
- Standalone por defecto.
- Un componente declarado en un NgModule necesita `standalone: false`
  explícito (Angular 22 asume standalone).
- Los NgModule clásicos se usan solo en las features indicadas a propósito.
  No convertir más features a NgModule sin que se pida.
- Siempre 3 archivos separados: `.ts` + `.html` + `.css` (o `.scss`).
  Nunca template ni estilos inline.
- Al usar `ng generate component`: pasar `--style=css` (o `scss`) y
  `--skip-tests`. No pasar `--inline-template` ni `--inline-style`.

### Estado y reactividad
- Estado con signals de Angular + servicios inyectables. Sin NgRx.
- El proyecto es zoneless (sin `zone.js`). Todo estado que deba verse en la UI
  tiene que ser un signal. Mutar una variable plana, o hacer un `subscribe()`
  sin volcar el valor a un signal, no actualiza la vista.
- **PROHIBIDO `computed()`** (y también `resource()`). Para un valor derivado
  de uno o más signals, usar un método protegido plano, sin envolverlo en
  `signal`, que lea esos signals adentro, e invocarlo desde el template.
  Angular trackea los signals leídos durante el render. El costo es que se
  recalcula en cada ciclo de detección, y es aceptable.
- Preferir signals o `async` pipe sobre subscribes manuales sin unsubscribe.

### Asincronía
- Usar solamente `async/await`. Los servicios que llaman al back exponen
  métodos `async` que convierten el Observable de `HttpClient` con
  `firstValueFrom` y devuelven el resultado; los errores se manejan con
  `try/catch` en quien los llama.
- **PROHIBIDO `tap()`** y encadenar operadores con `.pipe()` para efectos
  secundarios. Tampoco usar `.subscribe()` para consumir peticiones HTTP.

### Inputs / outputs
- Usar `input()` y `output()`.
- **PROHIBIDO `input.required()`.**
- Todo `input()` lleva valor por defecto: `input("")`, `input(false)`,
  `input<Tipo>("valorBase")`.
- Si el componente depende de que el padre pase el valor, chequear el valor
  vacío antes de usarlo.
- Un `input()` no está disponible en el constructor. Si el componente necesita
  su valor para cargar datos, hacerlo en `ngOnInit()`.

### Formularios
- Usar formularios reactivos.
- Leer los valores con `formulario.value`, nunca con `getRawValue()`.
  Los controles deshabilitados llegan como `undefined`.
- No escribir `novalidate` en los `<form>`: `ReactiveFormsModule` y
  `FormsModule` ya lo agregan solos.

### Estructura
- Organización por feature (`features/<dominio>/`), no por tipo técnico
  (`/components` o `/services` planos en la raíz).
- Los servicios de dominio viven en su feature. Los servicios transversales
  van en `core/`.

### Tests
- No generar tests unitarios (`*.spec.ts`) salvo que se pida explícitamente.

### Alcance
- Implementar el camino principal más las validaciones obvias (campos
  obligatorios, formatos básicos).
- No agregar protecciones defensivas para casos borde improbables (dobles
  envíos, carreras de render, etc.).
- No agregar extras de accesibilidad (ARIA, lectores de pantalla) si no se
  piden.
- Ante la duda, elegir el código más simple y mencionar el caso borde en una
  línea.
