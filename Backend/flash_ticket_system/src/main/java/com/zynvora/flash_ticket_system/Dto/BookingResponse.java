package com.zynvora.flash_ticket_system.Dto;

import com.zynvora.flash_ticket_system.Entity.Booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Booking booking;
    private String Response;
}
