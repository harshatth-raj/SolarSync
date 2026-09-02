package com.example.demo.util;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

    private String secretKey =
            "defaultSecretKeyForDevelopmentOnlyNotForProduction256Bits";

    private long jwtExpiration =
            86400000L;

    public JwtUtils() {
    }

    private Key getSigningKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(secretKey);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    // --------------------------------------------------
    // Generate JWT using UserDetails
    // --------------------------------------------------

    public String generateToken(
            UserDetails userDetails) {

        return generateToken(
                Map.of(),
                userDetails
        );
    }

    // --------------------------------------------------
    // Generate JWT using extra claims
    // --------------------------------------------------

    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails) {

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(
                        userDetails.getUsername()
                )
                .setIssuedAt(
                        new Date(System.currentTimeMillis())
                )
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpiration
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

    public String extractUsername(
            String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    // --------------------------------------------------
    // Extract claim
    // --------------------------------------------------

    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver) {

        final Claims claims =
                extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    // --------------------------------------------------
    // Extract all claims
    // --------------------------------------------------

    public Claims extractAllClaims(
            String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // --------------------------------------------------
    // Validate JWT
    // --------------------------------------------------

    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        final String username =
                extractUsername(token);

        return username.equals(
                userDetails.getUsername()
        )
                && !isTokenExpired(token);
    }

    // --------------------------------------------------
    // Check expiration
    // --------------------------------------------------

    private boolean isTokenExpired(
            String token) {

        return extractExpiration(token)
                .before(new Date());
    }

    private Date extractExpiration(
            String token) {

        return extractClaim(
                token,
                Claims::getExpiration
        );
    }
}