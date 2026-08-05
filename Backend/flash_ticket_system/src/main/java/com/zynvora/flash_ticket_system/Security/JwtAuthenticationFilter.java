package com.zynvora.flash_ticket_system.Security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailService customUserDetailService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
                String header = request.getHeader("Authorization");

                if (header == null || !header.startsWith("Bearer ")) {
                    filterChain.doFilter(request, response);
                    return;
                }

                try{
                    String token = header.substring(7);
                    String username = jwtService.extractUsername(token);

                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails user = customUserDetailService.loadUserByUsername(username);

                        if (jwtService.isValid(token, user)) {
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));   
                            SecurityContextHolder.getContext().setAuthentication(authentication);                           
                        }
                    }
                    }catch (ExpiredJwtException ex) {

                        logger.warn("JWT Token Expired");

                    } catch (MalformedJwtException ex) {

                        logger.warn("Malformed JWT Token");

                    } catch (Exception ex) {

                        logger.error("JWT Authentication Error", ex);

                    }

            filterChain.doFilter(request, response);

    }
    
}
