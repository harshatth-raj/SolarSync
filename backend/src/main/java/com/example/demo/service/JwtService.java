package com.example.demo.service;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
        this.userDetailsService =
                userDetailsService;
    }


    /* =========================================
       GENERATE TOKEN
    ========================================= */

    public String generateToken(String username) {

        throw new UnsupportedOperationException(
                "Use generateToken(UserDetails)"
        );
    }


    public String generateToken(
            UserDetails userDetails) {

        return jwtUtils.generateToken(
                userDetails
        );
    }


    /* =========================================
       EXTRACT USERNAME
    ========================================= */

    public String extractUsername(
            String token) {

        return jwtUtils.extractUsername(
                token
        );
    }


    /* =========================================
       LOAD USER
    ========================================= */

    public UserDetails loadUserByUsername(
            String username) {

        return userDetailsService
                .loadUserByUsername(username);
    }


    /* =========================================
       VALIDATE TOKEN
    ========================================= */

    public boolean isTokenValid(
            String token) {

        try {

            jwtUtils.extractAllClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }


    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        return jwtUtils.isTokenValid(
                token,
                userDetails
        );
    }


    /* =========================================
       CREATE AUTHENTICATION
    ========================================= */

    public Authentication getAuthentication(
            String token) {

        String username =
                extractUsername(token);

        UserDetails userDetails =
                loadUserByUsername(username);

        return getAuthentication(
                token,
                userDetails
        );
    }


    public Authentication getAuthentication(
            String token,
            UserDetails userDetails) {

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
    }
}