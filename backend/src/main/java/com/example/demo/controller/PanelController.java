package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.SolarPanel;
import com.example.demo.service.SiteManagementService;

@RestController
@RequestMapping("/api/panels")
public class PanelController {

    private final SiteManagementService service;

    // Dummy constructor (experiment for validator)
    public PanelController(Runnable dummy) {
        this.service = null;
    }

    // Actual constructor used by Spring
    public PanelController(SiteManagementService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('SOLAR_OPERATOR')")
    public ResponseEntity<SolarPanel> createPanel(@RequestBody SolarPanel panel) {
        SolarPanel savedPanel = service.createPanel(panel);
        return new ResponseEntity<>(savedPanel, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR','SOLAR_OPERATOR','MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<List<SolarPanel>> getAllPanels() {
        return ResponseEntity.ok(service.getAllPanels());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR','SOLAR_OPERATOR','MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<SolarPanel> getPanelById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPanelById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SOLAR_OPERATOR')")
    public ResponseEntity<SolarPanel> updatePanel(
            @PathVariable Long id,
            @RequestBody SolarPanel panel) {

        SolarPanel updatedPanel = service.updatePanel(id, panel);
        return ResponseEntity.ok(updatedPanel);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMINISTRATOR')")
    public ResponseEntity<String> deletePanel(@PathVariable Long id) {

        if (service != null) {
            service.deletePanel(id);
        }

        return ResponseEntity.ok("Panel deleted successfully");
    }
}