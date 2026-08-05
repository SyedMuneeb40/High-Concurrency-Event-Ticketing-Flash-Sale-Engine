package com.zynvora.flash_ticket_system.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.zynvora.flash_ticket_system.Entity.EventType;

public interface EventTypeRepository extends JpaRepository<EventType,Long>{
    Optional<EventType> findByEventType(String event_type);
}
