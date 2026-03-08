import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { UserProfile } from '../../models/auth.models';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
    template: `
    <div class="min-h-screen bg-surface-950">
      <app-navbar />

      <main class="pt-20 px-4 sm:px-6 lg:px-8 pb-12 max-w-3xl mx-auto">
        <!-- Page Header -->
        <div class="mt-8 mb-8 animate-fade-in">
          <h1 class="text-2xl font-bold text-white">My Profile</h1>
          <p class="text-slate-400 text-sm mt-1">Manage your account information and password</p>
        </div>

        <!-- Profile Card -->
        <div class="glass-card p-6 mb-6 animate-slide-up">
          <!-- Avatar -->
          <div class="flex items-center gap-5 mb-6 pb-6 border-b border-white/10">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl shadow-primary-500/30 flex-shrink-0">
              <span class="text-3xl font-bold text-white">{{ getUserInitial() }}</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ profile?.fullName || 'User' }}</h2>
              <p class="text-slate-400 text-sm">&#64;{{ profile?.username }}</p>
              <span class="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Account
              </span>
            </div>
          </div>

          <!-- Profile Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-white/3 border border-white/5">
              <p class="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Full Name</p>
              <p class="text-white font-medium">{{ profile?.fullName || '—' }}</p>
            </div>
            <div class="p-4 rounded-xl bg-white/3 border border-white/5">
              <p class="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Username</p>
              <p class="text-white font-medium">{{ profile?.username || '—' }}</p>
            </div>
            <div class="p-4 rounded-xl bg-white/3 border border-white/5 sm:col-span-2">
              <p class="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Email Address</p>
              <p class="text-white font-medium">{{ profile?.email || '—' }}</p>
            </div>
          </div>

          <button (click)="refreshProfile()" [disabled]="isRefreshing"
                  class="mt-4 flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors disabled:opacity-50">
            <svg class="w-4 h-4" [class.animate-spin]="isRefreshing" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ isRefreshing ? 'Refreshing...' : 'Refresh from API' }}
          </button>
        </div>

        <!-- Change Password Card -->
        <div class="glass-card p-6 animate-slide-up" style="animation-delay: 0.1s">
          <h2 class="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Change Password
          </h2>
          <p class="text-slate-400 text-sm mb-5">Update your account password</p>

          <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" novalidate>
            <!-- Current Password -->
            <div class="mb-4">
              <label class="auth-label" for="oldPassword">Current Password</label>
              <div class="relative">
                <input id="oldPassword" [type]="showOld ? 'text' : 'password'" formControlName="oldPassword"
                       class="auth-input pr-10" placeholder="Enter current password"
                       [class.ring-2]="isInvalid('oldPassword')" [class.ring-red-500]="isInvalid('oldPassword')">
                <button type="button" (click)="showOld = !showOld"
                        class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          [attr.d]="showOld ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                  </svg>
                </button>
              </div>
              @if (isInvalid('oldPassword')) {
                <span class="error-text">⚠ Current password is required</span>
              }
            </div>

            <!-- New Password -->
            <div class="mb-4">
              <label class="auth-label" for="newPassword">New Password</label>
              <div class="relative">
                <input id="newPassword" [type]="showNew ? 'text' : 'password'" formControlName="newPassword"
                       class="auth-input pr-10" placeholder="Min. 6 characters"
                       [class.ring-2]="isInvalid('newPassword')" [class.ring-red-500]="isInvalid('newPassword')">
                <button type="button" (click)="showNew = !showNew"
                        class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          [attr.d]="showNew ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"/>
                  </svg>
                </button>
              </div>
              @if (isInvalid('newPassword')) {
                <span class="error-text">⚠ New password must be at least 6 characters</span>
              }
            </div>

            <!-- Confirm Password -->
            <div class="mb-6">
              <label class="auth-label" for="confirmPassword">Confirm New Password</label>
              <input id="confirmPassword" type="password" formControlName="confirmPassword"
                     class="auth-input" placeholder="Repeat new password"
                     [class.ring-2]="isInvalid('confirmPassword')" [class.ring-red-500]="isInvalid('confirmPassword')">
              @if (passwordForm.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched) {
                <span class="error-text">⚠ Passwords do not match</span>
              }
            </div>

            <button type="submit" class="btn-primary" [disabled]="isChangingPassword">
              @if (isChangingPassword) {
                <div class="spinner"></div> Updating Password...
              } @else {
                Update Password
              }
            </button>
          </form>
        </div>
      </main>
    </div>
  `
})
export class ProfileComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private toastService = inject(ToastService);

    profile: UserProfile | null = null;
    isRefreshing = false;
    isChangingPassword = false;
    showOld = false;
    showNew = false;

    passwordForm: FormGroup = this.fb.group({
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

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
            next: (p) => { this.profile = p; this.isRefreshing = false; },
            error: (err: Error) => { this.toastService.error(err.message); this.isRefreshing = false; }
        });
    }

    isInvalid(field: string): boolean {
        const c = this.passwordForm.get(field);
        return !!(c?.invalid && c?.touched);
    }

    passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
        const newPw = form.get('newPassword')?.value;
        const confirmPw = form.get('confirmPassword')?.value;
        return newPw !== confirmPw ? { mismatch: true } : null;
    }

    onChangePassword(): void {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }
        this.isChangingPassword = true;
        const { oldPassword, newPassword } = this.passwordForm.value;
        this.authService.changePassword({ oldPassword, newPassword }).subscribe({
            next: (msg) => {
                this.toastService.success(msg || 'Password changed successfully!');
                this.passwordForm.reset();
                this.isChangingPassword = false;
            },
            error: (err: Error) => {
                this.toastService.error(err.message);
                this.isChangingPassword = false;
            }
        });
    }
}
