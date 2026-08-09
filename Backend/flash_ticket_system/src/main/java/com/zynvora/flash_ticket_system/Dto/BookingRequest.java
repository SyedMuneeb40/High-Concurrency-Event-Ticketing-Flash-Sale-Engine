package com.zynvora.flash_ticket_system.Dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long eventId;
    private Integer seats;

}
