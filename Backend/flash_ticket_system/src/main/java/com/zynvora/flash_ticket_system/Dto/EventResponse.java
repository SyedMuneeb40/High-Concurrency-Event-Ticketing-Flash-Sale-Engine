package com.zynvora.flash_ticket_system.Dto;

import com.zynvora.flash_ticket_system.Entity.Event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private Event event;
    private String response;
}
