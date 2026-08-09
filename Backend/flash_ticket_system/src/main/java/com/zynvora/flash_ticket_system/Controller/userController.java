package com.zynvora.flash_ticket_system.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zynvora.flash_ticket_system.Dto.BookingRequest;
import com.zynvora.flash_ticket_system.Dto.BookingResponse;
import com.zynvora.flash_ticket_system.Entity.Booking;
import com.zynvora.flash_ticket_system.Service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class userController {

    private final UserService userService;
    
    @PostMapping("/booking")
    public ResponseEntity<BookingResponse> doBooking(@RequestBody BookingRequest bookingRequest ) {
        BookingResponse bookingResponse = userService.addBooking(bookingRequest.getEventId(), bookingRequest.getSeats());
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingResponse);
    }

    @PatchMapping("/cancelBooking/{bookingId}")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long bookingId) {
        BookingResponse bookingResponse = userService.cancelBooking(bookingId);
        return ResponseEntity.ok(bookingResponse);
    }

    @GetMapping("/getbookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> allBookings = userService.getAllBooking();
        return ResponseEntity.ok(allBookings);
    }
    
    
}
