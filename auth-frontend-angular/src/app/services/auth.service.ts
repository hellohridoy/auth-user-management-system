import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
    LoginRequest, RegisterRequest, AuthResponse,
    UserProfile, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest
} from '../models/auth.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly API_URL = `${environment.apiUrl}/api/auth`;
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'auth_user';

    // Reactive signals for UI state
    currentUser = signal<UserProfile | null>(this.loadUser());
    isAuthenticated = signal<boolean>(!!this.getToken());

    constructor(private http: HttpClient, private router: Router) { }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
            tap(response => {
                this.saveToken(response.token);
                this.isAuthenticated.set(true);
                this.fetchProfile().subscribe();
            }),
            catchError(this.handleError)
        );
    }

    register(request: RegisterRequest): Observable<string> {
        return this.http.post(`${this.API_URL}/register`, request, { responseType: 'text' }).pipe(
            catchError(this.handleError)
        );
    }

    getProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.API_URL}/profile`).pipe(
            tap(profile => {
                this.currentUser.set(profile);
                localStorage.setItem(this.USER_KEY, JSON.stringify(profile));
            }),
            catchError(this.handleError)
        );
    }

    fetchProfile(): Observable<UserProfile> {
        return this.getProfile();
    }

    changePassword(request: ChangePasswordRequest): Observable<string> {
        return this.http.put(`${this.API_URL}/change-password`, request, { responseType: 'text' }).pipe(
            catchError(this.handleError)
        );
    }

    forgotPassword(request: ForgotPasswordRequest): Observable<string> {
        return this.http.post(`${this.API_URL}/forgot-password`, request, { responseType: 'text' }).pipe(
            catchError(this.handleError)
        );
    }

    resetPassword(request: ResetPasswordRequest): Observable<string> {
        return this.http.post(`${this.API_URL}/reset-password`, request, { responseType: 'text' }).pipe(
            catchError(this.handleError)
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private saveToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    private loadUser(): UserProfile | null {
        const userData = localStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let message = 'An unexpected error occurred';
        if (error.status === 0) {
            message = 'Cannot connect to server. Make sure the backend is running.';
        } else if (error.status === 401) {
            message = 'Invalid credentials. Please try again.';
        } else if (error.status === 400) {
            message = error.error || 'Bad request';
        } else if (error.error) {
            message = typeof error.error === 'string' ? error.error : error.error.message || message;
        }
        return throwError(() => new Error(message));
    }
}
