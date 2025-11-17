package com.regionalportal.security;

import com.regionalportal.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtil {

    private final String secret;
    private SecretKey secretKey;
    private final long jwtExpirationMs;

    public JwtTokenUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long jwtExpirationMs
    ) {
        this.secret = secret.trim();
        this.jwtExpirationMs = jwtExpirationMs;
    }


    @PostConstruct
    public void initKey() {
        try {
            byte[] keyBytes;
            // Detect Base64 vs raw string
            if (secret.matches("^[A-Za-z0-9+/=]+$") && secret.length() % 4 == 0) {
                keyBytes = Decoders.BASE64.decode(secret);
            } else {
                keyBytes = secret.getBytes(StandardCharsets.UTF_8);
            }
            this.secretKey = Keys.hmacShaKeyFor(keyBytes);
            System.out.println("🔐 JWT SecretKey initialized successfully (hash=" + secretKey.hashCode() + ")");
        } catch (Exception e) {
            throw new IllegalStateException(" Failed to initialize JWT secret key: " + e.getMessage(), e);
        }
    }


    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("email", user.getEmail());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .setIssuer("RegionalPortalSystem")
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }


    public String getUsernameFromToken(String token) {
        return getAllClaimsFromToken(cleanToken(token)).getSubject();
    }


    public boolean validateToken(String token, UserDetails userDetails) {
        token = cleanToken(token);
        try {
            final String username = getUsernameFromToken(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            System.err.println("️ Token expired for user: " + e.getClaims().getSubject());
        } catch (UnsupportedJwtException e) {
            System.err.println("⚠ Unsupported JWT token: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.err.println("⚠ Malformed JWT token: " + e.getMessage());
        } catch (SignatureException e) {
            System.err.println(" Invalid JWT signature: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("⚠ Illegal argument while validating JWT: " + e.getMessage());
        }
        return false;
    }


    public boolean validateToken(String token) {
        token = cleanToken(token);
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            System.err.println(" Invalid JWT: " + e.getMessage());
            return false;
        }
    }


    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    private boolean isTokenExpired(String token) {
        final Date expiration = getAllClaimsFromToken(token).getExpiration();
        return expiration.before(new Date());
    }


    private String cleanToken(String token) {
        if (token == null) return "";
        return token.startsWith("Bearer ") ? token.substring(7) : token;
    }


    public long getExpirationMillis() {
        return jwtExpirationMs;
    }
}
