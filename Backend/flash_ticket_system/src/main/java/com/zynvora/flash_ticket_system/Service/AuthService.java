package com.zynvora.flash_ticket_system.Service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zynvora.flash_ticket_system.Dto.AuthResponse;
import com.zynvora.flash_ticket_system.Dto.LoginRequest;
import com.zynvora.flash_ticket_system.Dto.SignupRequest;
import com.zynvora.flash_ticket_system.Entity.Role;
import com.zynvora.flash_ticket_system.Entity.User;
import com.zynvora.flash_ticket_system.Repository.RoleRepository;
import com.zynvora.flash_ticket_system.Repository.UserRepository;
import com.zynvora.flash_ticket_system.Security.CustomUserDetailService;
import com.zynvora.flash_ticket_system.Security.JwtService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailService customUserDetailService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

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

    public void register(SignupRequest request){
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User Already Exists with this email");
        }

        Role role = roleRepository.findByRoleName("ROLE_USER").orElseThrow(()-> new RuntimeException("Role Not Found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.getRoles().add(role);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
    }

    public void registerAdmin(SignupRequest request){
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User Already Exists with this email");
        }

        Role role = roleRepository.findByRoleName("ROLE_ADMIN").orElseThrow(()-> new RuntimeException("Role Not Found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.getRoles().add(role);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
    }
    
}
