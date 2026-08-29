package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    // POST /api/panels
    // --------------------------------------------------

    @PostMapping
    public ResponseEntity<SolarPanel> createPanel(
            @RequestBody SolarPanel panel) {

        return new ResponseEntity<>(
                service.createPanel(panel),
                HttpStatus.CREATED
        );
    }

    // --------------------------------------------------
    // GET ALL PANELS
    // GET /api/panels
    // --------------------------------------------------

    @GetMapping
    public ResponseEntity<List<SolarPanel>> getAllPanels() {

        return ResponseEntity.ok(
                service.getAllPanels()
        );
    }

    // --------------------------------------------------
    // GET PANEL BY ID
    // GET /api/panels/{id}
    // --------------------------------------------------

    @GetMapping("/{id}")
    public ResponseEntity<SolarPanel> getPanelById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getPanelById(id)
        );
    }

    // --------------------------------------------------
    // GET PANELS BY SITE
    // GET /api/panels/site/{siteId}
    // --------------------------------------------------

    @GetMapping("/site/{siteId}")
    public ResponseEntity<List<SolarPanel>> getPanelsBySite(
            @PathVariable Long siteId) {

        return ResponseEntity.ok(
                service.getPanelsBySite(siteId)
        );
    }

    // --------------------------------------------------
    // UPDATE PANEL
    // PUT /api/panels/{id}
    // --------------------------------------------------

    @PutMapping("/{id}")
    public ResponseEntity<SolarPanel> updatePanel(
            @PathVariable Long id,
            @RequestBody SolarPanel panel) {

        return ResponseEntity.ok(
                service.updatePanel(id, panel)
        );
    }

    // --------------------------------------------------
    // DELETE PANEL
    // DELETE /api/panels/{id}
    // --------------------------------------------------

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePanel(
            @PathVariable Long id) {

        service.deletePanel(id);

        return ResponseEntity.ok(
                "Panel deleted successfully"
        );
    }
}