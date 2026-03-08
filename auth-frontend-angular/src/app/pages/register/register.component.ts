import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-screen bg-auth-gradient flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <!-- Animated blobs -->
      <div class="absolute top-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div class="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-float pointer-events-none" style="animation-delay: 2s"></div>

      <div class="w-full max-w-md animate-slide-up">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-primary-600 mb-4 shadow-xl shadow-purple-500/30">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white">Create an account</h1>
          <p class="text-slate-400 mt-2 text-sm">Join SpringAuth today</p>
        </div>

        <div class="glass-card p-8 shadow-2xl">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" novalidate>
            <!-- Full Name -->
            <div class="mb-4">
              <label class="auth-label" for="fullName">Full Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <input id="fullName" type="text" formControlName="fullName" class="auth-input pl-10"
                       placeholder="John Doe"
                       [class.ring-2]="isInvalid('fullName')" [class.ring-red-500]="isInvalid('fullName')">
              </div>
              @if (isInvalid('fullName')) {
                <span class="error-text">⚠ Full name is required</span>
              }
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label class="auth-label" for="email">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                </div>
                <input id="email" type="email" formControlName="email" class="auth-input pl-10"
                       placeholder="john@example.com"
                       [class.ring-2]="isInvalid('email')" [class.ring-red-500]="isInvalid('email')">
              </div>
              @if (isInvalid('email')) {
                <span class="error-text">⚠ {{ getEmailError() }}</span>
              }
            </div>

            <!-- Username -->
            <div class="mb-4">
              <label class="auth-label" for="username">Username</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <input id="username" type="text" formControlName="username" class="auth-input pl-10"
                       placeholder="johndoe"
                       [class.ring-2]="isInvalid('username')" [class.ring-red-500]="isInvalid('username')">
              </div>
              @if (isInvalid('username')) {
                <span class="error-text">⚠ Username must be at least 3 characters</span>
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
                       class="auth-input pl-10 pr-10" placeholder="Min. 6 characters"
                       [class.ring-2]="isInvalid('password')" [class.ring-red-500]="isInvalid('password')">
                <button type="button" (click)="showPassword = !showPassword"
                        class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (showPassword) {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    } @else {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    }
                  </svg>
                </button>
              </div>
              @if (isInvalid('password')) {
                <span class="error-text">⚠ Password must be at least 6 characters</span>
              }
            </div>

            <button type="submit" class="btn-primary" [disabled]="isLoading">
              @if (isLoading) {
                <div class="spinner"></div> Creating account...
              } @else {
                Create Account
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              }
            </button>
          </form>

          <p class="text-center text-sm text-slate-400 mt-6">
            Already have an account?
            <a routerLink="/auth/login" class="text-primary-400 hover:text-primary-300 font-medium transition-colors ml-1">
              Sign in →
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    registerForm: FormGroup = this.fb.group({
        fullName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    isLoading = false;
    showPassword = false;

    isInvalid(field: string): boolean {
        const c = this.registerForm.get(field);
        return !!(c?.invalid && c?.touched);
    }

    getEmailError(): string {
        const c = this.registerForm.get('email');
        if (c?.hasError('required')) return 'Email is required';
        if (c?.hasError('email')) return 'Please enter a valid email address';
        return '';
    }

    onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        this.authService.register(this.registerForm.value).subscribe({
            next: (msg) => {
                this.toastService.success(msg || 'Account created successfully! Please log in.');
                this.router.navigate(['/auth/login']);
            },
            error: (err: Error) => {
                this.toastService.error(err.message);
                this.isLoading = false;
            }
        });
    }
}
