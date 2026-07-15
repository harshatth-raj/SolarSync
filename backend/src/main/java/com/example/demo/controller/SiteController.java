package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('SYSTEM_ADMINISTRATOR')")
    public ResponseEntity<SolarSite> createSite(@RequestBody SolarSite site) {

        SolarSite savedSite = service.createSite(site);

        return new ResponseEntity<>(savedSite, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR','SOLAR_OPERATOR','MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<List<SolarSite>> getAllSites() {

        return ResponseEntity.ok(service.getAllSites());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMINISTRATOR','SOLAR_OPERATOR','MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<SolarSite> getSiteById(@PathVariable Long id) {

        return ResponseEntity.ok(service.getSiteById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMINISTRATOR')")
    public ResponseEntity<SolarSite> updateSite(
            @PathVariable Long id,
            @RequestBody SolarSite site) {

        SolarSite updatedSite = service.updateSite(id, site);

        return ResponseEntity.ok(updatedSite);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMINISTRATOR')")
    public ResponseEntity<String> deleteSite(@PathVariable Long id) {

        service.deleteSite(id);

        return ResponseEntity.ok("Site deleted successfully");
    }
}