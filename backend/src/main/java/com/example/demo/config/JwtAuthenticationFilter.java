package com.example.demo.config;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        /* No token */
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token =
                authHeader.substring(7);

        try {

            /*
             * Load username from JWT
             */
            String username =
                    jwtService.extractUsername(token);

            /*
             * Only authenticate if there is no existing
             * authentication.
             */
            if (username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                /*
                 * Load the actual user from database
                 */
                var userDetails =
                        jwtService.loadUserByUsername(username);

                /*
                 * Validate JWT against the user
                 */
                if (jwtService.isTokenValid(
                        token,
                        userDetails)) {

                    var authentication =
                            jwtService.getAuthentication(
                                    token,
                                    userDetails);

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication);
                }
            }

        } catch (Exception e) {

            /*
             * Invalid token:
             * leave SecurityContext unauthenticated.
             */
            SecurityContextHolder
                    .clearContext();
        }

        filterChain.doFilter(request, response);
    }
}