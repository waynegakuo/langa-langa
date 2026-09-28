import { Routes } from '@angular/router';

import { AppShell } from './layout/app-shell/app-shell';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/calendar/calendar').then((m) => m.Calendar),
      },
      {
        path: 'drivers',
        loadComponent: () =>
          import('./features/drivers/drivers').then((m) => m.Drivers),
      },
      {
        path: 'sessions/:sessionKey',
        loadComponent: () =>
          import('./features/session-detail/session-detail').then(
            (m) => m.SessionDetail
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
