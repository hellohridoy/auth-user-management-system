package com.example.springauth.service;

import com.example.springauth.dto.AuthDto.*;
import com.example.springauth.model.User;
import com.example.springauth.repository.UserRepository;
import com.example.springauth.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        return new AuthResponse(jwt);
    }

    public String register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return "Username is already taken!";
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return "Email is already in use!";
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .email(registerRequest.getEmail())
                .fullName(registerRequest.getFullName())
                .build();

        userRepository.save(user);
        return "User registered successfully!";
    }

    public UserProfileResponse getCurrentProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        UserProfileResponse profile = new UserProfileResponse();
        profile.setUsername(user.getUsername());
        profile.setEmail(user.getEmail());
        profile.setFullName(user.getFullName());
        return profile;
    }

    public String changePassword(ChangePasswordRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return "Invalid old password!";
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password changed successfully!";
    }

    // Forgot/Reset password simulation
    public String forgotPassword(ForgotPasswordRequest request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());
        if (user.isEmpty()) {
            return "Email not found!";
        }
        // In a real app, generate a reset token, save it, and send an email.
        return "Password reset link sent to your email (Simulated)";
    }

    public String resetPassword(ResetPasswordRequest request) {
        // In a real app, validate the token and find the user.
        return "Password reset successfully (Simulated)";
    }
}
