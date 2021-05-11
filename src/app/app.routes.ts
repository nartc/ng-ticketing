import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'tickets',
    pathMatch: 'full',
  },
  {
    path: 'tickets',
    loadChildren: () =>
      import('./tickets/features/shell/shell.module').then(
        (m) => m.ShellModule,
      ),
  },
];
