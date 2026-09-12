package com.example.demo.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.EnergyMetric;
import com.example.demo.service.MetricService;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = "*")
public class MetricController {

    private final MetricService service;

    public MetricController(MetricService service) {
        this.service = service;
    }

    // --------------------------------------------------
    // Create one metric
    // --------------------------------------------------

    @PostMapping
    public ResponseEntity<EnergyMetric> createMetric(
            @RequestBody EnergyMetric metric) {

        return ResponseEntity.ok(
                service.createMetric(metric)
        );
    }

    // --------------------------------------------------
    // Create multiple metrics
    // --------------------------------------------------

    @PostMapping("/batch")
    public ResponseEntity<List<EnergyMetric>> createMetrics(
            @RequestBody List<EnergyMetric> metrics) {

        return ResponseEntity.ok(
                service.createMetrics(metrics)
        );
    }

    // --------------------------------------------------
    // SIMULATE GENERATION
    // --------------------------------------------------

    @PostMapping("/simulate/{panelId}")
    public ResponseEntity<EnergyMetric> simulateGeneration(
            @PathVariable Long panelId) {

        return ResponseEntity.ok(
                service.simulateGeneration(panelId)
        );
    }

    // --------------------------------------------------
    // Get recent metrics
    // --------------------------------------------------

    @GetMapping("/recent")
    public ResponseEntity<List<EnergyMetric>> getRecentMetrics() {

        return ResponseEntity.ok(
                service.getRecentMetrics()
        );
    }

    // --------------------------------------------------
    // Get analytics
    // --------------------------------------------------

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {

        return ResponseEntity.ok(
                service.getAnalytics()
        );
    }

    // --------------------------------------------------
    // Calculate daily energy
    // --------------------------------------------------

    @GetMapping("/daily-energy")
    public ResponseEntity<BigDecimal> getDailyEnergy() {

        return ResponseEntity.ok(
                service.getDailyEnergy()
        );
    }

    // --------------------------------------------------
    // Calculate system efficiency
    // --------------------------------------------------

    @GetMapping("/efficiency")
    public ResponseEntity<BigDecimal> getSystemEfficiency() {

        return ResponseEntity.ok(
                service.getSystemEfficiency()
        );
    }

    // --------------------------------------------------
    // Get maintenance cost
    // --------------------------------------------------

    @GetMapping("/maintenance-cost")
    public ResponseEntity<BigDecimal> getMaintenanceCost() {

        return ResponseEntity.ok(
                service.getMaintenanceCost()
        );
    }

    // --------------------------------------------------
    // Calculate all dashboard metrics
    // --------------------------------------------------

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {

        return ResponseEntity.ok(
                service.getDashboardMetrics()
        );
    }

    // --------------------------------------------------
    // Get metrics by panel
    // --------------------------------------------------

    @GetMapping("/panel/{panelId}")
    public ResponseEntity<List<EnergyMetric>> getMetricsByPanel(
            @PathVariable Long panelId) {

        return ResponseEntity.ok(
                service.getMetricsByPanel(panelId)
        );
    }
}