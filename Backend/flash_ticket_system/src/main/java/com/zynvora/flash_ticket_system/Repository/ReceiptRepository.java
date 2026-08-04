package com.zynvora.flash_ticket_system.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.zynvora.flash_ticket_system.Entity.Receipt;

public interface ReceiptRepository extends JpaRepository<Receipt,Long> {
    Optional<Receipt> findByReceiptNumber(String receipt_number);
}
