package com.synexiops.auth_service.controller;

import com.synexiops.auth_service.dto.LoginRequest;
import com.synexiops.auth_service.dto.SignupRequest;
import com.synexiops.auth_service.security.JwtUtils;
import com.synexiops.auth_service.service.AuthService;
import com.synexiops.auth_service.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    public AuthController(AuthService authService, JwtUtils jwtUtils, CustomUserDetailsService userDetailsService) {
        this.authService = authService;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody @Valid SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody @Valid LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid token");
        }

        String token = authHeader.substring(7);
        if (!jwtUtils.validateToken(token)) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        String email = jwtUtils.extractUsername(token);
        UserDetails user = userDetailsService.loadUserByUsername(email);

        return ResponseEntity.ok(Map.of(
                "email", user.getUsername(),
                "roles", user.getAuthorities()
        ));
    }

}
