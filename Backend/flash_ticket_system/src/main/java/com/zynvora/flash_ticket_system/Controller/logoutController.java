package com.zynvora.flash_ticket_system.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zynvora.flash_ticket_system.Entity.User;
import com.zynvora.flash_ticket_system.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class logoutController {

    private final RedisTemplate<String , String> redisTemplate;
    private final UserRepository userRepository;

    @PostMapping("/logout")
    public ResponseEntity<String> logout(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not Found"));
        redisTemplate.delete("refresh:user:"+user.getId());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Successfully User Logout");
    }
    
}
