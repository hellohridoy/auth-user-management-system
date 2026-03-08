import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <!-- Background -->
    <div class="min-h-screen bg-auth-gradient flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <!-- Animated blobs -->
      <div class="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float pointer-events-none" style="animation-delay: 3s"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Card -->
      <div class="w-full max-w-md animate-slide-up">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mb-4 shadow-xl shadow-primary-500/30">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white">Welcome back</h1>
          <p class="text-slate-400 mt-2 text-sm">Sign in to your SpringAuth account</p>
        </div>

        <!-- Form Card -->
        <div class="glass-card p-8 shadow-2xl">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
            <!-- Username -->
            <div class="mb-5">
              <label class="auth-label" for="username">Username</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <input id="username" type="text" formControlName="username"
                       class="auth-input pl-10" placeholder="Enter your username"
                       [class.ring-2]="isInvalid('username')" [class.ring-red-500]="isInvalid('username')">
              </div>
              @if (isInvalid('username')) {
                <span class="error-text">⚠ Username is required</span>
              }
            </div>

            <!-- Password -->
            <div class="mb-6">
              <label class="auth-label" for="password">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input id="password" [type]="showPassword ? 'text' : 'password'" formControlName="password"
                       class="auth-input pl-10 pr-10" placeholder="Enter your password"
                       [class.ring-2]="isInvalid('password')" [class.ring-red-500]="isInvalid('password')">
                <button type="button" (click)="showPassword = !showPassword"
                        class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white transition-colors">
                  @if (showPassword) {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  } @else {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  }
                </button>
              </div>
              @if (isInvalid('password')) {
                <span class="error-text">⚠ Password is required</span>
              }
            </div>

            <!-- Forgot password link -->
            <div class="flex justify-end mb-6 -mt-3">
              <a routerLink="/auth/forgot-password" class="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <!-- Submit -->
            <button type="submit" class="btn-primary" [disabled]="isLoading">
              @if (isLoading) {
                <div class="spinner"></div>
                Signing in...
              } @else {
                Sign In
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              }
            </button>
          </form>

          <!-- Register link -->
          <p class="text-center text-sm text-slate-400 mt-6">
            Don't have an account?
            <a routerLink="/auth/register" class="text-primary-400 hover:text-primary-300 font-medium transition-colors ml-1">
              Create one →
            </a>
          </p>
        </div>

        <!-- Footer -->
        <p class="text-center text-xs text-slate-600 mt-6">
          Secured by Spring Boot JWT Authentication
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    loginForm: FormGroup = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });

    isLoading = false;
    showPassword = false;

    isInvalid(field: string): boolean {
        const control = this.loginForm.get(field);
        return !!(control?.invalid && control?.touched);
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        this.authService.login(this.loginForm.value).subscribe({
            next: () => {
                this.toastService.success('Welcome back! Logged in successfully.');
                this.router.navigate(['/dashboard']);
            },
            error: (err: Error) => {
                this.toastService.error(err.message);
                this.isLoading = false;
            }
        });
    }
}
