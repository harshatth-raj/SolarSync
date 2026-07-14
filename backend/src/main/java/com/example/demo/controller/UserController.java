package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.service.AuthService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final AuthService service;

    public UserController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<SystemUser> register(@RequestBody RegisterDto dto) {

        return new ResponseEntity<>(
                service.register(dto),
                HttpStatus.CREATED);

    }

    @GetMapping
    public ResponseEntity<List<SystemUser>> getAllUsers() {

        return ResponseEntity.ok(
                service.getAllUsers());

    }

    @GetMapping("/{id}")
    public ResponseEntity<SystemUser> getUserById(@PathVariable Long id) {

        return ResponseEntity.ok(
                service.getUserById(id));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {

        service.deleteUser(id);

        return ResponseEntity.ok("User deleted successfully");

    }

}