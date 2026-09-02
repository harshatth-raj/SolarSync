package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.TicketRequestDto;
import com.example.demo.entity.MaintenanceTicket;
import com.example.demo.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SOLAR_OPERATOR', 'ROLE_MAINTENANCE_TECHNICIAN', 'ROLE_SYSTEM_ADMINISTRATOR')")
    public ResponseEntity<List<MaintenanceTicket>> getTickets() {

        return ResponseEntity.ok(
                service.getAllTickets()
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SOLAR_OPERATOR', 'ROLE_MAINTENANCE_TECHNICIAN', 'ROLE_SYSTEM_ADMINISTRATOR')")
    public ResponseEntity<MaintenanceTicket> createTicket(
            @RequestBody TicketRequestDto dto) {

        MaintenanceTicket ticket =
                service.createTicket(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ticket);
    }

    @PutMapping("/{ticketId}/assign")
    @PreAuthorize("hasAnyAuthority('ROLE_MAINTENANCE_TECHNICIAN', 'ROLE_SYSTEM_ADMINISTRATOR')")
    public ResponseEntity<MaintenanceTicket> assignTicket(
            @PathVariable Long ticketId,
            @RequestParam Long technicianId) {

        return ResponseEntity.ok(
                service.assignTicket(
                        ticketId,
                        technicianId
                )
        );
    }

    @PatchMapping("/{ticketId}/resolve")
    @PreAuthorize("hasAnyAuthority('ROLE_MAINTENANCE_TECHNICIAN', 'ROLE_SYSTEM_ADMINISTRATOR')")
    public ResponseEntity<MaintenanceTicket> resolveTicket(
            @PathVariable Long ticketId) {

        return ResponseEntity.ok(
                service.resolveTicket(ticketId)
        );
    }
}