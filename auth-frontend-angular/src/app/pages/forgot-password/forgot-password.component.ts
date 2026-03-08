import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-auth-gradient flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div class="absolute top-1/3 -left-20 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div class="absolute bottom-1/3 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-float pointer-events-none" style="animation-delay: 3s"></div>

      <div class="w-full max-w-md animate-slide-up">
        <!-- Icon -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-xl shadow-amber-500/30">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white">Forgot password?</h1>
          <p class="text-slate-400 mt-2 text-sm">Enter your email to receive a reset link</p>
        </div>

        @if (!emailSent) {
          <div class="glass-card p-8 shadow-2xl">
            <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" novalidate>
              <div class="mb-6">
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
                  <span class="error-text">⚠ Please enter a valid email address</span>
                }
              </div>

              <button type="submit" class="btn-primary" [disabled]="isLoading">
                @if (isLoading) {
                  <div class="spinner"></div> Sending...
                } @else {
                  Send Reset Link
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                }
              </button>
            </form>

            <p class="text-center text-sm text-slate-400 mt-6">
              Remember your password?
              <a routerLink="/auth/login" class="text-primary-400 hover:text-primary-300 font-medium transition-colors ml-1">Sign in →</a>
            </p>
          </div>
        } @else {
          <!-- Success State -->
          <div class="glass-card p-8 shadow-2xl text-center">
            <div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white mb-2">Check your email</h2>
            <p class="text-slate-400 text-sm mb-2">We sent a password reset link to</p>
            <p class="text-primary-400 font-semibold text-sm mb-6">{{ forgotForm.get('email')?.value }}</p>
            <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400 mb-6">
              📧 Note: This is a simulated response from the Spring Boot API. In production, an actual email would be sent.
            </div>
            <a [routerLink]="['/auth/reset-password']" class="btn-primary inline-flex mb-4">
              Test Reset Password Flow
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>
            <div class="block">
              <a routerLink="/auth/login" class="text-slate-400 hover:text-white transition-colors text-sm">← Back to Sign In</a>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = false;
  emailSent = false;

  isInvalid(field: string): boolean {
    const c = this.forgotForm.get(field);
    return !!(c?.invalid && c?.touched);
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.authService.forgotPassword(this.forgotForm.value).subscribe({
      next: (msg) => {
        this.emailSent = true;
        this.toastService.info(msg);
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.toastService.error(err.message);
        this.isLoading = false;
      }
    });
  }
}
