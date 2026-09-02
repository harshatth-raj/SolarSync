package com.example.demo.util;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

public class JwtUtils {

    private String SECRET_KEY =
            "VGhpc0lzQVNlY3VyZVNvbGFyU3luY0pXVFNlY3JldEtleUZvclNwcmluZ0Jvb3Qz";

    private long JWT_EXPIRATION =
            1000 * 60 * 60 * 24;

    public JwtUtils() {
    }

    private Key getSigningKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(SECRET_KEY);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    // --------------------------------------------------
    // Generate JWT using username
    // --------------------------------------------------

    public static String generateTokenFromUsername(
            String username) {

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + JWT_EXPIRATION
                        )
                )
                .signWith(
                        getSigningKey(),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

    // --------------------------------------------------
    // Generate JWT using UserDetails
    // --------------------------------------------------

    public static String generateToken(
            UserDetails userDetails) {

        String role = userDetails
                .getAuthorities()
                .stream()
                .findFirst()
                .map(authority ->
                        authority.getAuthority()
                )
                .orElse("");

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + JWT_EXPIRATION
                        )
                )
                .signWith(
                        getSigningKey(),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

    // --------------------------------------------------
    // Extract username
    // --------------------------------------------------

    public static String extractUsername(
            String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    // --------------------------------------------------
    // Extract role
    // --------------------------------------------------

    public static String extractRole(
            String token) {

        return extractClaim(
                token,
                claims -> claims.get(
                        "role",
                        String.class
                )
        );
    }

    // --------------------------------------------------
    // Extract any claim
    // --------------------------------------------------

    public static <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver) {

        Claims claims =
                extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    // --------------------------------------------------
    // Extract all claims
    // --------------------------------------------------

    public static Claims extractAllClaims(
            String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // --------------------------------------------------
    // isTokenValid - required by validation
    // --------------------------------------------------

    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        String username =
                extractUsername(token);

        return username.equals(
                userDetails.getUsername()
        )
                && !isTokenExpired(token);
    }

    // --------------------------------------------------
    // Existing validation
    // --------------------------------------------------

    public static boolean validateToken(
            String token) {

        try {

            extractAllClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }

    public static boolean validateToken(
            String token,
            UserDetails userDetails) {

        return usernameMatches(
                token,
                userDetails
        );
    }

    private static boolean usernameMatches(
            String token,
            UserDetails userDetails) {

        String username =
                extractUsername(token);

        return username.equals(
                userDetails.getUsername()
        )
                && !isTokenExpired(token);
    }

    // --------------------------------------------------
    // Check expiration
    // --------------------------------------------------

    private static boolean isTokenExpired(
            String token) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }
}