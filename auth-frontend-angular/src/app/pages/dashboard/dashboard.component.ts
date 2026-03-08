import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { UserProfile } from '../../models/auth.models';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    template: `
    <div class="min-h-screen bg-surface-950">
      <app-navbar />

      <main class="pt-20 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl mx-auto">
        <!-- Welcome Header -->
        <div class="mt-8 mb-8 animate-fade-in">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl shadow-primary-500/30 flex-shrink-0">
              <span class="text-2xl font-bold text-white">{{ getUserInitial() }}</span>
            </div>
            <div>
              <p class="text-slate-400 text-sm font-medium">Welcome back,</p>
              <h1 class="text-2xl font-bold text-white">{{ profile?.fullName || profile?.username || 'User' }} 👋</h1>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-up">
          <div class="glass-card p-5 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Username</p>
              <p class="text-white font-semibold mt-0.5 truncate">{{ profile?.username || '—' }}</p>
            </div>
          </div>

          <div class="glass-card p-5 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Email</p>
              <p class="text-white font-semibold mt-0.5 truncate">{{ profile?.email || '—' }}</p>
            </div>
          </div>

          <div class="glass-card p-5 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Status</p>
              <p class="text-emerald-400 font-semibold mt-0.5">Authenticated ✓</p>
            </div>
          </div>
        </div>

        <!-- API Endpoints Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- API Endpoints Reference -->
          <div class="glass-card p-6 animate-slide-up" style="animation-delay: 0.1s">
            <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              API Endpoints
            </h2>
            <div class="space-y-3">
              @for (endpoint of apiEndpoints; track endpoint.path) {
                <div class="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors">
                  <span [class]="getMethodClass(endpoint.method)" class="text-xs font-bold px-2 py-0.5 rounded-md min-w-[52px] text-center">
                    {{ endpoint.method }}
                  </span>
                  <code class="text-slate-300 text-xs font-mono flex-1 truncate">{{ endpoint.path }}</code>
                  <span class="text-xs text-slate-500 hidden sm:block">{{ endpoint.auth ? '🔒' : '🔓' }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="glass-card p-6 animate-slide-up" style="animation-delay: 0.2s">
            <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Quick Actions
            </h2>
            <div class="space-y-3">
              <a routerLink="/profile"
                 class="flex items-center gap-3 p-4 rounded-xl bg-primary-600/10 border border-primary-500/20 hover:bg-primary-600/20 transition-all duration-200 group">
                <div class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-semibold text-sm">Edit Profile</p>
                  <p class="text-slate-400 text-xs">Update your account details</p>
                </div>
                <svg class="w-4 h-4 text-slate-500 ml-auto group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>

              <a routerLink="/profile"
                 class="flex items-center gap-3 p-4 rounded-xl bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 transition-all duration-200 group">
                <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-semibold text-sm">Change Password</p>
                  <p class="text-slate-400 text-xs">Update your security credentials</p>
                </div>
                <svg class="w-4 h-4 text-slate-500 ml-auto group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>

              <button (click)="refreshProfile()"
                      class="w-full flex items-center gap-3 p-4 rounded-xl bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all duration-200 group">
                <div class="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-emerald-400" [class.animate-spin]="isRefreshing" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <div class="text-left">
                  <p class="text-white font-semibold text-sm">Refresh Profile</p>
                  <p class="text-slate-400 text-xs">Reload data from API</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- JWT Token Display -->
        <div class="mt-6 glass-card p-6 animate-slide-up" style="animation-delay: 0.3s">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
              </svg>
              JWT Token
            </h2>
            <button (click)="copyToken()" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-white/10">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <div class="bg-black/30 border border-white/5 rounded-xl p-3 overflow-x-auto">
            <code class="text-xs text-amber-300/80 font-mono break-all whitespace-pre-wrap">{{ getToken() }}</code>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
    authService = inject(AuthService);
    private toastService = inject(ToastService);

    profile: UserProfile | null = null;
    isRefreshing = false;
    copied = false;

    apiEndpoints = [
        { method: 'POST', path: '/api/auth/login', auth: false },
        { method: 'POST', path: '/api/auth/register', auth: false },
        { method: 'GET', path: '/api/auth/profile', auth: true },
        { method: 'PUT', path: '/api/auth/change-password', auth: true },
        { method: 'POST', path: '/api/auth/forgot-password', auth: false },
        { method: 'POST', path: '/api/auth/reset-password', auth: false },
    ];

    ngOnInit(): void {
        this.profile = this.authService.currentUser();
        if (!this.profile) {
            this.refreshProfile();
        }
    }

    getUserInitial(): string {
        return this.profile?.username?.charAt(0).toUpperCase() || '?';
    }

    refreshProfile(): void {
        this.isRefreshing = true;
        this.authService.getProfile().subscribe({
            next: (p) => {
                this.profile = p;
                this.isRefreshing = false;
                this.toastService.success('Profile refreshed!');
            },
            error: (err: Error) => {
                this.toastService.error(err.message);
                this.isRefreshing = false;
            }
        });
    }

    getToken(): string {
        const token = this.authService.getToken();
        return token ? token : 'No token found';
    }

    copyToken(): void {
        const token = this.authService.getToken();
        if (token) {
            navigator.clipboard.writeText(token).then(() => {
                this.copied = true;
                setTimeout(() => this.copied = false, 2000);
                this.toastService.success('Token copied to clipboard!');
            });
        }
    }

    getMethodClass(method: string): string {
        switch (method) {
            case 'GET': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            case 'POST': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            case 'PUT': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
            case 'DELETE': return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    }
}
