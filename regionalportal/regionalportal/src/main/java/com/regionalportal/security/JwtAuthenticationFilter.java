package com.regionalportal.security;

import com.regionalportal.service.impl.UserDetailsServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        final String requestURI = request.getRequestURI();
        log.info("🟦 Incoming request: {}", requestURI);


        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            chain.doFilter(request, response);
            return;
        }


        if (requestURI.startsWith("/api/auth")) {
            log.debug("🟨 Public endpoint detected — skipping JWT validation");
            chain.doFilter(request, response);
            return;
        }


        final String header = request.getHeader(HEADER_STRING);
        String username = null;
        String authToken = null;

        if (header != null && header.startsWith(TOKEN_PREFIX)) {
            authToken = header.substring(TOKEN_PREFIX.length());
            try {
                username = jwtTokenUtil.getUsernameFromToken(authToken);
                log.debug(" Username extracted from JWT: {}", username);
            } catch (ExpiredJwtException e) {
                log.warn("⚠ JWT expired: {}", e.getMessage());
            } catch (SignatureException e) {
                log.error(" Invalid JWT signature: {}", e.getMessage());
            } catch (Exception e) {
                log.error(" Error parsing JWT: {}", e.getMessage());
            }
        } else {
            log.debug(" Missing or malformed Authorization header");
        }


        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtTokenUtil.validateToken(authToken, userDetails)) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("✅ User '{}' authenticated successfully", username);
            } else {
                log.warn(" Invalid JWT for user '{}'", username);
                SecurityContextHolder.clearContext();
            }
        }


        chain.doFilter(request, response);
        log.debug("🟩 JwtAuthenticationFilter finished for {}", requestURI);
    }
}
