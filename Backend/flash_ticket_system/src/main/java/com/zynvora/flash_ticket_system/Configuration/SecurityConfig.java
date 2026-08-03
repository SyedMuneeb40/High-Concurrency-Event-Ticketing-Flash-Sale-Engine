package com.zynvora.flash_ticket_system.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain (HttpSecurity http) throws Exception{
        http
        .csrf(csrf -> csrf.disable() )
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(req -> req
            .requestMatchers("/auth/admin/**").hasRole("ADMIN")
            .requestMatchers("/auth/user/**").hasRole("USER")
            .anyRequest().authenticated()
        )
        .httpBasic(Customizer.withDefaults());
        return http.build();
    }
    
    @Bean
    public UserDetailsManager userDetailsManager (PasswordEncoder passwordEncoder){
        UserDetails admin = User.builder()
                                .username("admin")
                                .password(passwordEncoder.encode("admin123"))
                                .roles("ADMIN")
                                .build();

        UserDetails user = User.builder()
                                .username("user")
                                .password(passwordEncoder.encode("admin123"))
                                .roles("USER")
                                .build();

        return new InMemoryUserDetailsManager(admin,user);       
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
