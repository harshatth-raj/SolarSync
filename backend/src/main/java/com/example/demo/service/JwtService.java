package com.example.demo.service;

import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.demo.util.JwtUtils;

@Service
public class JwtService {

    // --------------------------------------------------
    // Generate token using username
    // --------------------------------------------------

    public String generateToken(String username) {

        return JwtUtils.generateTokenFromUsername(username);
    }

    // --------------------------------------------------
    // Generate token using UserDetails
    // --------------------------------------------------

    public String generateToken(
            UserDetails userDetails) {

        return JwtUtils.generateToken(
                userDetails
        );
    }

    // --------------------------------------------------
    // Extract username
    // --------------------------------------------------

    public String extractUsername(
            String token) {

        return JwtUtils.extractUsername(token);
    }

    // --------------------------------------------------
    // Validate token
    // --------------------------------------------------

    public boolean isTokenValid(
            String token) {

        return JwtUtils.validateToken(token);
    }

    // --------------------------------------------------
    // Validate token using UserDetails
    // --------------------------------------------------

    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        return JwtUtils.validateToken(
                token,
                userDetails
        );
    }

    // --------------------------------------------------
    // Get Authentication from JWT
    // --------------------------------------------------

    public Authentication getAuthentication(
            String token) {

        String username =
                JwtUtils.extractUsername(token);

        String role =
                JwtUtils.extractRole(token);

        /*
         * If the JWT contains:
         *
         * ROLE_SYSTEM_ADMINISTRATOR
         *
         * use it directly.
         *
         * If it contains:
         *
         * SYSTEM_ADMINISTRATOR
         *
         * add ROLE_ prefix.
         */

        String authorityName = role;

        if (role != null
                && !role.startsWith("ROLE_")) {

            authorityName =
                    "ROLE_" + role;
        }

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(
                        authorityName
                );

        return new UsernamePasswordAuthenticationToken(
                username,
                null,
                Collections.singletonList(
                        authority
                )
        );
    }
}