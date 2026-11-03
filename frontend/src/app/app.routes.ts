import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: async () => (await import('./features/autenticacion/login/login.component')).LoginComponent,
  },
  {
    path: 'registro',
    loadComponent: async () =>
      (await import('./features/autenticacion/registro/registro.component')).RegistroComponent,
  },
  {
    path: 'publicaciones',
    loadComponent: async () =>
      (await import('./features/publicaciones/publicaciones/publicaciones.component')).PublicacionesComponent,
  },
  {
    path: 'mi-perfil',
    loadComponent: async () => (await import('./features/perfil/mi-perfil/mi-perfil.component')).MiPerfilComponent,
  },
  { path: '**', redirectTo: 'publicaciones' },
];
