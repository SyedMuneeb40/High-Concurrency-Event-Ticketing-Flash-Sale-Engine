package com.zynvora.flash_ticket_system.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.zynvora.flash_ticket_system.Entity.Booking;
import com.zynvora.flash_ticket_system.Entity.Receipt;
import com.zynvora.flash_ticket_system.Entity.User;
import com.zynvora.flash_ticket_system.Enums.PaymentMethod;
import com.zynvora.flash_ticket_system.Enums.PaymentStatus;
import com.zynvora.flash_ticket_system.Entity.Event;
import com.zynvora.flash_ticket_system.Repository.BookingRepository;
import com.zynvora.flash_ticket_system.Repository.EventRepository;
import com.zynvora.flash_ticket_system.Repository.ReceiptRepository;
import com.zynvora.flash_ticket_system.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReceiptService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final ReceiptRepository receiptRepository;

    public Receipt generateReceipt(Long bookingId , PaymentMethod paymentMethod){
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(()->new RuntimeException("Booking not found with this Id"));
        Event event = eventRepository.findById(booking.getEvent().getId()).orElseThrow(()->new RuntimeException("Event not found with this Id"));
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User authenticatedUser = userRepository.findByEmail(username).orElseThrow(()->new RuntimeException("User Not found with this Email"));
        User bookingUser = booking.getUser();
        if (!authenticatedUser.getEmail().equals(bookingUser.getEmail())) {
            throw new RuntimeException("The booking you are generating receipt is not your booking");
        }
        Receipt bookingReceipt = new Receipt();
        bookingReceipt.setBooking(booking);
        bookingReceipt.setIssuedAt(Timestamp.from(Instant.now()));
        BigDecimal totalPrice = event.getTicket_price().multiply(BigDecimal.valueOf(booking.getSeatQuantity()));
        bookingReceipt.setAmount(totalPrice);
        bookingReceipt.setPaymentMethod(paymentMethod);
        bookingReceipt.setPaymentStatus(PaymentStatus.SUCCESS);
        bookingReceipt.setReceiptNumber("RCP-"+ UUID.randomUUID());
        
        receiptRepository.save(bookingReceipt);
        return bookingReceipt;
    }
    
}
