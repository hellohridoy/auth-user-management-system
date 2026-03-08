import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="min-h-screen bg-auth-gradient flex items-center justify-center px-4 relative overflow-hidden">
      <div class="absolute top-1/3 -left-20 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div class="absolute bottom-1/3 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-float pointer-events-none" style="animation-delay: 3s"></div>

      <div class="text-center animate-slide-up">
        <div class="text-8xl font-black text-gradient mb-4">404</div>
        <h1 class="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p class="text-slate-400 mb-8 max-w-sm mx-auto text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a routerLink="/dashboard" class="btn-primary inline-flex max-w-xs">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  `
})
export class NotFoundComponent { }
