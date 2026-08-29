package com.example.demo.controller;

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
    // POST /api/metrics
    // --------------------------------------------------

    @PostMapping
    public ResponseEntity<EnergyMetric> createMetric(
            @RequestBody EnergyMetric metric) {

        return ResponseEntity.ok(
                service.createMetric(metric)
        );
    }

    // --------------------------------------------------
    // POST /api/metrics/batch
    // --------------------------------------------------

    @PostMapping("/batch")
    public ResponseEntity<List<EnergyMetric>> createMetrics(
            @RequestBody List<EnergyMetric> metrics) {

        return ResponseEntity.ok(
                service.createMetrics(metrics)
        );
    }

    // --------------------------------------------------
    // GET /api/metrics/recent
    // --------------------------------------------------

    @GetMapping("/recent")
    public ResponseEntity<List<EnergyMetric>> getRecentMetrics() {

        return ResponseEntity.ok(
                service.getRecentMetrics()
        );
    }

    // --------------------------------------------------
    // GET /api/metrics/analytics
    // --------------------------------------------------

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {

        return ResponseEntity.ok(
                service.getAnalytics()
        );
    }

    // --------------------------------------------------
    // GET /api/metrics/panel/{panelId}
    // --------------------------------------------------

    @GetMapping("/panel/{panelId}")
    public ResponseEntity<List<EnergyMetric>> getMetricsByPanel(
            @PathVariable Long panelId) {

        return ResponseEntity.ok(
                service.getMetricsByPanel(panelId)
        );
    }
}