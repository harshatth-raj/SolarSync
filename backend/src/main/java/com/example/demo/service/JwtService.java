package com.example.demo.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.demo.util.JwtUtils;

@Service
public class JwtService {

    private final JwtUtils jwtUtils;

    public JwtService(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    // Generate token using username
    public String generateToken(String username) {
        return jwtUtils.generateTokenFromUsername(username);
    }

    // Generate token using UserDetails
    public String generateToken(UserDetails userDetails) {
        return jwtUtils.generateToken(userDetails);
    }

    // Extract username
    public String extractUsername(String token) {
        return jwtUtils.extractUsername(token);
    }

    // --------------------------------------------------
    // Required by JwtAuthenticationFilter
    // --------------------------------------------------

    public boolean isTokenValid(String token) {

        try {
            jwtUtils.extractAllClaims(token);
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    // --------------------------------------------------
    // Required by JwtAuthenticationFilter
    // --------------------------------------------------

    public Authentication getAuthentication(String token) {

        String username =
                jwtUtils.extractUsername(token);

        return new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                username,
                null,
                java.util.Collections.emptyList()
        );
    }

    // --------------------------------------------------
    // UserDetails validation
    // --------------------------------------------------

    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        return jwtUtils.isTokenValid(
                token,
                userDetails
        );
    }
}