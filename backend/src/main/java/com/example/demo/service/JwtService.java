package com.example.demo.service;

import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.demo.util.JwtUtils;

@Service
public class JwtService {

    public String generateToken(String username) {
        return JwtUtils.generateToken(username);
    }

    public String extractUsername(String token) {
        return JwtUtils.extractUsername(token);
    }

    public boolean isTokenValid(String token) {
        return JwtUtils.validateToken(token);
    }

    public Authentication getAuthentication(String token) {

        String username = extractUsername(token);

        return new UsernamePasswordAuthenticationToken(
                username,
                null,
                Collections.emptyList());

    }

}