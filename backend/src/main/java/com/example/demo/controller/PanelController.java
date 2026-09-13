package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.SolarPanel;
import com.example.demo.service.PanelServiceInterface;

@RestController
@RequestMapping("/api/panels")
public class PanelController {

    private final PanelServiceInterface service;

    public PanelController(PanelServiceInterface service) {
        this.service = service;
    }

    // --------------------------------------------------
    // CREATE PANEL
    // All three roles can create a panel
    // --------------------------------------------------

    @PostMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR','SOLAR_OPERATOR','MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<SolarPanel> createPanel(
            @RequestBody SolarPanel panel) {

        return new ResponseEntity<>(
                service.createPanel(panel),
                HttpStatus.CREATED
        );
    }


    // --------------------------------------------------
    // GET ALL PANELS
    // --------------------------------------------------

    @GetMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR','SOLAR_OPERATOR','MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<List<SolarPanel>> getAllPanels() {

        return ResponseEntity.ok(
                service.getAllPanels()
        );
    }


    // --------------------------------------------------
    // GET PANEL BY ID
    // --------------------------------------------------

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR','SOLAR_OPERATOR','MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<SolarPanel> getPanelById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getPanelById(id)
        );
    }


    // --------------------------------------------------
    // GET PANELS BY SITE
    // THIS IS THE IMPORTANT ONE FOR YOUR FORM
    // --------------------------------------------------

    @GetMapping("/site/{siteId}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR','SOLAR_OPERATOR','MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<List<SolarPanel>> getPanelsBySite(
            @PathVariable Long siteId) {

        return ResponseEntity.ok(
                service.getPanelsBySite(siteId)
        );
    }


    // --------------------------------------------------
    // UPDATE PANEL
    // --------------------------------------------------

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMINISTRATOR')")
    public ResponseEntity<SolarPanel> updatePanel(
            @PathVariable Long id,
            @RequestBody SolarPanel panel) {

        return ResponseEntity.ok(
                service.updatePanel(id, panel)
        );
    }


    // --------------------------------------------------
    // DELETE PANEL
    // --------------------------------------------------

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMINISTRATOR')")
    public ResponseEntity<String> deletePanel(
            @PathVariable Long id) {

        service.deletePanel(id);

        return ResponseEntity.ok(
                "Panel deleted successfully"
        );
    }
}