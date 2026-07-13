package com.example.demo.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.SystemUserRepository;

@Service
@Transactional
public class AuthService {

    private final SystemUserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public AuthService(SystemUserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    // Create User
    public SystemUser createUser(RegisterDto dto) {

        SystemUser user = new SystemUser();

        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setUser(dto.getUser());

        return repo.save(user);
    }

    // Get All Users
    @Transactional(readOnly = true)
    public List<SystemUser> getAllUsers() {
        return repo.findAll();
    }

    // Get User By Id
    @Transactional(readOnly = true)
    public SystemUser getUser(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id : " + id));
    }

    // Update User
    public SystemUser UpdateUser(Long id, RegisterDto dto) {

        SystemUser user = getUser(id);

        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setUser(dto.getUser());

        return repo.save(user);
    }

    // Delete User
    public void deleteUser(Long id) {

        SystemUser user = getUser(id);

        repo.delete(user);
    }
}