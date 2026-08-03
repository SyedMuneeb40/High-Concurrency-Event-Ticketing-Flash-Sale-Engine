package com.zynvora.flash_ticket_system.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.zynvora.flash_ticket_system.Entity.User;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User>findByEmail(String email);
}
