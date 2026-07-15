package com.example.demo.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.SystemUserRepository;

@Service
@Transactional
public class AuthService {

    private final SystemUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            SystemUserRepository repository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // -----------------------------
    // Register User
    // -----------------------------

    public SystemUser register(RegisterDto dto) {

        if (repository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (repository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        SystemUser user = new SystemUser();

        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());

        return repository.save(user);
    }

    // -----------------------------
    // Login User
    // -----------------------------

    public AuthResponseDto login(AuthRequestDto dto) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getUsername(),
                        dto.getPassword()));

        SystemUser user = repository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT using UserDetails
        String token = jwtService.generateToken(user);

        return new AuthResponseDto(
                token,
                user.getUsername(),
                user.getRole().name());
    }

    // -----------------------------
    // Get All Users
    // -----------------------------

    @Transactional(readOnly = true)
    public List<SystemUser> getAllUsers() {
        return repository.findAll();
    }

    // -----------------------------
    // Get User By Id
    // -----------------------------

    @Transactional(readOnly = true)
    public SystemUser getUserById(Long id) {

        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // -----------------------------
    // Delete User
    // -----------------------------

    public void deleteUser(Long id) {

        SystemUser user = getUserById(id);

        repository.delete(user);
    }

}