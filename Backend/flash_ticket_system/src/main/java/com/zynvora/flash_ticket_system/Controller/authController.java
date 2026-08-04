package com.zynvora.flash_ticket_system.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zynvora.flash_ticket_system.Dto.AuthResponse;
import com.zynvora.flash_ticket_system.Dto.LoginRequest;
import com.zynvora.flash_ticket_system.Dto.SignupRequest;
import com.zynvora.flash_ticket_system.Service.AuthService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class authController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody SignupRequest signupRequest) {
        authService.register(signupRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Successfully User is Registered");
    }

    //only admin can access
    @PostMapping("/registerAdmin")
    public ResponseEntity<String> registerAdmin(@Valid @RequestBody SignupRequest signupRequest) {
        authService.registerAdmin(signupRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Successfully Admin is Registered");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authreposne = authService.login(request);
        
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(authreposne);
    }
    
    
}
