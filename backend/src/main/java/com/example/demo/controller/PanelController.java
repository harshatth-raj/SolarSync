package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.SolarPanel;
import com.example.demo.service.PanelService;

@RestController
@RequestMapping("/api/panels")
public class PanelController {

    private final PanelService service;

    public PanelController(PanelService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SolarPanel> createPanel(@RequestBody SolarPanel panel) {
        return new ResponseEntity<>(service.createPanel(panel), HttpStatus.CREATED);
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

        return ResponseEntity.ok(service.updatePanel(id, panel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePanel(@PathVariable Long id) {

        service.deletePanel(id);

        return ResponseEntity.ok("Panel deleted successfully");
    }
}