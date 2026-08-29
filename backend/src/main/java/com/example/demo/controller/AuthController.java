package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // --------------------------------------------------
    // LOGIN
    // POST /api/auth/login
    // --------------------------------------------------

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(
            @RequestBody AuthRequestDto dto) {

        return ResponseEntity.ok(
                authService.login(dto)
        );
    }

    // --------------------------------------------------
    // REGISTER
    // POST /api/auth/register
    // --------------------------------------------------

    @PostMapping("/register")
    public ResponseEntity<SystemUser> register(
            @RequestBody RegisterDto dto) {

        SystemUser user =
                authService.register(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(user);
    }
}