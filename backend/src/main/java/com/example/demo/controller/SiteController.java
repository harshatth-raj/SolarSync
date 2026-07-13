package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.SolarSite;
import com.example.demo.service.SiteService;

@RestController
@RequestMapping("/api/sites")
public class SiteController {

    private final SiteService service;

    public SiteController(SiteService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SolarSite> createSite(@RequestBody SolarSite site) {
        return new ResponseEntity<>(service.createSite(site), HttpStatus.CREATED);
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

        return ResponseEntity.ok(service.updateSite(id, site));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSite(@PathVariable Long id) {

        service.deleteSite(id);

        return ResponseEntity.ok("Site deleted successfully");
    }
}