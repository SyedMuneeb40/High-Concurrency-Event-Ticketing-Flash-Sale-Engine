package com.zynvora.flash_ticket_system.Dto;

import com.zynvora.flash_ticket_system.Enums.PaymentMethod;

import lombok.Data;

@Data
public class ReceiptRequest {
    private Long bookingId;
    private PaymentMethod paymentMethod;
    
}
