package com.example.demo.service;

import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.demo.util.JwtUtils;

@Service
public class JwtService {

    // Existing method
    public String generateToken(String username) {
        return JwtUtils.generateToken(username);
    }

    // Added overload
    public String generateToken(UserDetails userDetails) {
        return JwtUtils.generateToken(userDetails);
    }

    public String extractUsername(String token) {
        return JwtUtils.extractUsername(token);
    }

    // Existing method
    public boolean isTokenValid(String token) {
        return JwtUtils.validateToken(token);
    }

    // Added overload
    public boolean isTokenValid(String token, UserDetails userDetails) {
        return JwtUtils.validateToken(token, userDetails);
    }

    public Authentication getAuthentication(String token) {

        String username = extractUsername(token);

        return new UsernamePasswordAuthenticationToken(
                username,
                null,
                Collections.emptyList());
    }
}