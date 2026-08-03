package com.zynvora.flash_ticket_system.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String AccessToken;
    private String RefreshToken;
}
