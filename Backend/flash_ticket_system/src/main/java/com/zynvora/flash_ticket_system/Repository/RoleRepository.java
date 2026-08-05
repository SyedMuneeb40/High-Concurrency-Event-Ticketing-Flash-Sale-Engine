package com.zynvora.flash_ticket_system.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.zynvora.flash_ticket_system.Entity.Role;


public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByRoleName(String role_name);
}
