// Auth models matching Spring Boot DTOs

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    fullName: string;
}

export interface AuthResponse {
    token: string;
    type: string;
}

export interface UserProfile {
    username: string;
    email: string;
    fullName: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface ApiError {
    message: string;
    status?: number;
}
