package com.example.demo.dto;

import com.example.demo.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterDto {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @Email
    @NotBlank
    private String email;

    private Role user;

    public RegisterDto() {
    }

    public RegisterDto(String username, String password, String email, Role user) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.user = user;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getUser() {
        return user;
    }

    public void setUser(Role user) {
        this.user = user;
    }
}