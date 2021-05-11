import { Routes } from '@angular/router';

export const ticketRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('../list/list.module').then((m) => m.ListModule),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('../detail/detail.module').then((m) => m.DetailModule),
  },
];
