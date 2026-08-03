package com.zynvora.flash_ticket_system.Service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.zynvora.flash_ticket_system.Dto.AuthResponse;
import com.zynvora.flash_ticket_system.Dto.LoginRequest;
import com.zynvora.flash_ticket_system.Security.CustomUserDetailService;
import com.zynvora.flash_ticket_system.Security.JwtService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailService customUserDetailService;

    public AuthResponse login (LoginRequest request){
        //1st authenticate user
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        //2nd find user in db through userdetailservice
        UserDetails user = customUserDetailService.loadUserByUsername(request.getEmail());
        //3rd generate jwt after authenticate
        String accessToken = jwtService.generateAccessToken(user);
        //4th generate jwt refresh token after jwt
        String refreshToken = jwtService.generateRefreshToken(user);
        return new AuthResponse(accessToken,refreshToken);
    }
    
}
