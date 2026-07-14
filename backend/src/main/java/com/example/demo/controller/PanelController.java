package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.SolarPanel;
import com.example.demo.service.SiteManagementService;

@RestController
@RequestMapping("/api/panels")
public class PanelController {

    private final SiteManagementService service;

    public PanelController(SiteManagementService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SolarPanel> createPanel(@RequestBody SolarPanel panel) {

        SolarPanel savedPanel = service.createPanel(panel);

        return new ResponseEntity<>(savedPanel, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SolarPanel>> getAllPanels() {

        return ResponseEntity.ok(service.getAllPanels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolarPanel> getPanelById(@PathVariable Long id) {

        return ResponseEntity.ok(service.getPanelById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolarPanel> updatePanel(
            @PathVariable Long id,
            @RequestBody SolarPanel panel) {

        SolarPanel updatedPanel = service.updatePanel(id, panel);

        return ResponseEntity.ok(updatedPanel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePanel(@PathVariable Long id) {

        service.deletePanel(id);

        return ResponseEntity.ok("Panel deleted successfully");
    }
}