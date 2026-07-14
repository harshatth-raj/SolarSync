package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.SolarSite;
import com.example.demo.service.SiteManagementService;

@RestController
@RequestMapping("/api/sites")
public class SiteController {

    private final SiteManagementService service;

    public SiteController(SiteManagementService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SolarSite> createSite(@RequestBody SolarSite site) {

        SolarSite savedSite = service.createSite(site);

        return new ResponseEntity<>(savedSite, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SolarSite>> getAllSites() {

        return ResponseEntity.ok(service.getAllSites());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolarSite> getSiteById(@PathVariable Long id) {

        return ResponseEntity.ok(service.getSiteById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolarSite> updateSite(
            @PathVariable Long id,
            @RequestBody SolarSite site) {

        SolarSite updatedSite = service.updateSite(id, site);

        return ResponseEntity.ok(updatedSite);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSite(@PathVariable Long id) {

        service.deleteSite(id);

        return ResponseEntity.ok("Site deleted successfully");
    }
}