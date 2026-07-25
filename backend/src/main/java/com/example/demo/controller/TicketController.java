package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<String> getTickets() {
        return ResponseEntity.ok("Success");
    }
}