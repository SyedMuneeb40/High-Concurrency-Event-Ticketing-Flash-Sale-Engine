package com.zynvora.flash_ticket_system.Dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class EventRequest {
    private String event_name;
    private String event_mode;
    private Integer total_Seats;
    private BigDecimal Price;
    private LocalDateTime localDateTime;
}
