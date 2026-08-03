package com.zynvora.flash_ticket_system.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String event_name;
    @ManyToOne (fetch = FetchType.EAGER)
    @JoinTable(
        name = "event_mode",
        joinColumns = @JoinColumn (name = "event_id"),
        inverseJoinColumns = @JoinColumn (name = "eventtype_id")
    )
    private EventType event_mode;
    @Column(nullable = false)
    private Integer  total_seats;
    @Column(nullable = false)
    private Integer  reserved_seats;
    @Column(nullable = false)
    private Integer  ticket_price;
}
