package com.zynvora.flash_ticket_system.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.zynvora.flash_ticket_system.Entity.Booking;

public interface BookingRepository extends JpaRepository<Booking,Long> {
    
}
