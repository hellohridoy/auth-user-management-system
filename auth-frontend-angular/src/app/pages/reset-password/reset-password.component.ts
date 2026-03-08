import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-screen bg-auth-gradient flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div class="absolute top-1/3 -left-20 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div class="absolute bottom-1/3 -right-20 w-80 h-80 bg-teal-600/20 rounded-full blur-3xl animate-float pointer-events-none" style="animation-delay: 2s"></div>

      <div class="w-full max-w-md animate-slide-up">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-xl shadow-emerald-500/30">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white">Reset Password</h1>
          <p class="text-slate-400 mt-2 text-sm">Enter your reset token and new password</p>
        </div>

        @if (!resetSuccess) {
          <div class="glass-card p-8 shadow-2xl">
            <!-- Info note -->
            <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400 mb-6">
              ℹ️ In production, the reset token would be sent via email. For testing, use any token value.
            </div>

            <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" novalidate>
              <!-- Token -->
              <div class="mb-4">
                <label class="auth-label" for="token">Reset Token</label>
                <input id="token" type="text" formControlName="token" class="auth-input"
                       placeholder="Enter reset token"
                       [class.ring-2]="isInvalid('token')" [class.ring-red-500]="isInvalid('token')">
                @if (isInvalid('token')) {
                  <span class="error-text">⚠ Reset token is required</span>
                }
              </div>

              <!-- New Password -->
              <div class="mb-6">
                <label class="auth-label" for="newPassword">New Password</label>
                <div class="relative">
                  <input id="newPassword" [type]="showPassword ? 'text' : 'password'" formControlName="newPassword"
                         class="auth-input pr-10" placeholder="Min. 6 characters"
                         [class.ring-2]="isInvalid('newPassword')" [class.ring-red-500]="isInvalid('newPassword')">
                  <button type="button" (click)="showPassword = !showPassword"
                          class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            [attr.d]="showPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                    </svg>
                  </button>
                </div>
                @if (isInvalid('newPassword')) {
                  <span class="error-text">⚠ Password must be at least 6 characters</span>
                }
              </div>

              <button type="submit" class="btn-primary" [disabled]="isLoading">
                @if (isLoading) { <div class="spinner"></div> Resetting... }
                @else { Reset Password }
              </button>
            </form>

            <p class="text-center text-sm text-slate-400 mt-6">
              <a routerLink="/auth/login" class="text-primary-400 hover:text-primary-300 font-medium transition-colors">← Back to Sign In</a>
            </p>
          </div>
        } @else {
          <div class="glass-card p-8 shadow-2xl text-center">
            <div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white mb-2">Password Reset!</h2>
            <p class="text-slate-400 text-sm mb-6">Your password has been reset successfully</p>
            <a routerLink="/auth/login" class="btn-primary inline-flex">Sign In Now →</a>
          </div>
        }
      </div>
    </div>
  `
})
export class ResetPasswordComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);

    resetForm: FormGroup = this.fb.group({
        token: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    isLoading = false;
    showPassword = false;
    resetSuccess = false;

    isInvalid(field: string): boolean {
        const c = this.resetForm.get(field);
        return !!(c?.invalid && c?.touched);
    }

    onSubmit(): void {
        if (this.resetForm.invalid) {
            this.resetForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        this.authService.resetPassword(this.resetForm.value).subscribe({
            next: (msg) => {
                this.resetSuccess = true;
                this.toastService.success(msg || 'Password reset successfully');
                this.isLoading = false;
            },
            error: (err: Error) => {
                this.toastService.error(err.message);
                this.isLoading = false;
            }
        });
    }
}
