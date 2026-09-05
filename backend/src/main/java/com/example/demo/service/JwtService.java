package com.example.demo.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.stereotype.Service;

import com.example.demo.util.JwtUtils;

@Service
public class JwtService {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public JwtService(
            JwtUtils jwtUtils,
            UserDetailsService userDetailsService) {

        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    public String generateToken(String username) {
        throw new UnsupportedOperationException(
                "Use generateToken(UserDetails)"
        );
    }

    public String generateToken(UserDetails userDetails) {
        return jwtUtils.generateToken(userDetails);
    }

    public String extractUsername(String token) {
        return jwtUtils.extractUsername(token);
    }

    public boolean isTokenValid(String token) {

        try {
            jwtUtils.extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Authentication getAuthentication(String token) {

        String username =
                jwtUtils.extractUsername(token);

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(username);

        return new org.springframework.security.authentication
                .UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
    }

    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        return jwtUtils.isTokenValid(
                token,
                userDetails
        );
    }
}