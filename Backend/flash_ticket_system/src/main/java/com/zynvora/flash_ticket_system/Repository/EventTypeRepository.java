package com.zynvora.flash_ticket_system.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.zynvora.flash_ticket_system.Entity.EventType;

public interface EventTypeRepository extends JpaRepository<EventType,Long>{
    
}
