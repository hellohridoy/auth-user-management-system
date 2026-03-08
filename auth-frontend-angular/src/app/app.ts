import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './services/toast.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <router-outlet />

    <!-- Toast Container -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2" style="min-width:320px;">
      @for (toast of toastService.toasts(); track toast.id) {
        <div [class]="getToastClass(toast.type)"
             class="flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-2xl backdrop-blur-xl border text-sm font-medium animate-slide-up">
          <span class="text-lg">{{ getToastIcon(toast.type) }}</span>
          <span class="flex-1">{{ toast.message }}</span>
          <button (click)="toastService.remove(toast.id)"
                  class="opacity-60 hover:opacity-100 transition-opacity ml-2 text-xs font-bold">✕</button>
        </div>
      }
    </div>
  `
})
export class AppComponent {
  toastService = inject(ToastService);
  authService = inject(AuthService);

  getToastClass(type: Toast['type']): string {
    const base = 'bg-opacity-10 border';
    switch (type) {
      case 'success': return 'bg-emerald-500 border-emerald-500/30 text-emerald-300';
      case 'error': return 'bg-red-900 border-red-500/30 text-red-300';
      case 'info': return 'bg-indigo-900 border-indigo-500/30 text-indigo-300';
      default: return 'bg-slate-800 border-slate-600 text-white';
    }
  }

  getToastIcon(type: Toast['type']): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }
}
