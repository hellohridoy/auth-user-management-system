import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                canActivate: [guestGuard],
                loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                canActivate: [guestGuard],
                loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
            },
            {
                path: 'forgot-password',
                canActivate: [guestGuard],
                loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
            },
            {
                path: 'reset-password',
                canActivate: [guestGuard],
                loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
            }
        ]
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
