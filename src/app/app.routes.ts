import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'role',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () => import('./features/home/home-module').then((m) => m.HomeModule),
      },
      {
        path: 'dashboard',
        // canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/dashboard/dashboard-module').then((m) => m.DashboardModule),
      },
      {
        path: 'user',
        // canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/user/user-module').then((m) => m.UserModule),
      },
      {
        path: 'role',
        // canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/role/role-module').then((m) => m.RoleModule),
      },
      {
        path: 'permission',
        // canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/permission/permission-module').then((m) => m.PermissionModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./features/auth/auth-module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
