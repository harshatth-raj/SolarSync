package com.example.demo.util;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

public class JwtUtils {

    // Minimum 256-bit secret (Base64 encoded)
private static final String SECRET_KEY =
"VGhpc0lzQVNlY3VyZVNvbGFyU3luY0pXVFNlY3JldEtleUZvclNwcmluZ0Jvb3Qz";

    private static final long JWT_EXPIRATION = 1000 * 60 * 60 * 24;

    private JwtUtils() {
    }

    private static Key getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);

        SecretKey key = Keys.hmacShaKeyFor(keyBytes);

        return key;
    }

    public static String generateToken(String username) {

        return Jwts.builder()

                .subject(username)

                .issuedAt(new Date())

                .expiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))

                .signWith(getSigningKey())

                .compact();

    }

    public static String extractUsername(String token) {

        return extractAllClaims(token).getSubject();

    }

    public static boolean validateToken(String token) {

        try {

            extractAllClaims(token);

            return true;

        } catch (Exception e) {

            return false;

        }

    }

    public static Claims extractAllClaims(String token) {

        return Jwts.parser()

                .verifyWith((SecretKey) getSigningKey())

                .build()

                .parseSignedClaims(token)

                .getPayload();

    }

}