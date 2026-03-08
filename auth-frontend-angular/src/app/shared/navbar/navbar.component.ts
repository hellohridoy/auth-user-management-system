import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <nav class="fixed top-0 left-0 right-0 z-40 border-b border-white/5 backdrop-blur-xl bg-surface-950/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/dashboard" class="flex items-center gap-3 group">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center
                        group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-200">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <span class="text-white font-bold text-lg tracking-tight">SpringAuth</span>
          </a>

          <!-- Nav Links -->
          <div class="hidden md:flex items-center gap-1">
            <a routerLink="/dashboard" routerLinkActive="nav-link-active" [routerLinkActiveOptions]="{exact:true}"
               class="nav-link">Dashboard</a>
            <a routerLink="/profile" routerLinkActive="nav-link-active"
               class="nav-link">Profile</a>
          </div>

          <!-- User Menu -->
          <div class="flex items-center gap-3">
            @if (authService.currentUser()) {
              <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                  <span class="text-xs font-bold text-white">{{ getUserInitial() }}</span>
                </div>
                <span class="text-sm text-slate-300 font-medium">{{ authService.currentUser()?.username }}</span>
              </div>
            }
            <button (click)="logout()"
                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400
                           hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20
                           transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
    authService = inject(AuthService);
    private router = inject(Router);

    getUserInitial(): string {
        return this.authService.currentUser()?.username?.charAt(0).toUpperCase() || '?';
    }

    logout(): void {
        this.authService.logout();
    }
}
