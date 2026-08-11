package com.zynvora.flash_ticket_system.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zynvora.flash_ticket_system.Dto.ReceiptRequest;
import com.zynvora.flash_ticket_system.Entity.Receipt;
import com.zynvora.flash_ticket_system.Service.ReceiptService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
@RequestMapping("/receipt")
public class ReceiptController {
    private final ReceiptService receiptService;

    @PostMapping("/generate")
    public ResponseEntity<Receipt> genearteReceipt(@RequestBody ReceiptRequest request) {
        Receipt receipt = receiptService.generateReceipt(request.getBookingId(),request.getPaymentMethod());
        return ResponseEntity.ok(receipt);
    }
    
}
