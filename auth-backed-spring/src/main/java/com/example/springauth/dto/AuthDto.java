package com.example.springauth.dto;

import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String username;
        private String password;
        private String email;
        private String fullName;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";

        public AuthResponse(String token) {
            this.token = token;
        }
    }

    @Data
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
    }

    @Data
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
    }

    @Data
    public static class UserProfileResponse {
        private String username;
        private String email;
        private String fullName;
    }
}
