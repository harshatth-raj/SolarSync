package com.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.EnergyMetric;
import com.example.demo.enums.PanelStatus;
import com.example.demo.enums.TicketStatus;
import com.example.demo.repository.EnergyMetricRepository;
import com.example.demo.repository.MaintenanceTicketRepository;
import com.example.demo.repository.SolarPanelRepository;

@Service
@Transactional
public class MetricService {

    private final EnergyMetricRepository repository;
    private final SolarPanelRepository panelRepository;
    private final MaintenanceTicketRepository ticketRepository;

    public MetricService(
            EnergyMetricRepository repository,
            SolarPanelRepository panelRepository,
            MaintenanceTicketRepository ticketRepository) {

        this.repository = repository;
        this.panelRepository = panelRepository;
        this.ticketRepository = ticketRepository;
    }

    // --------------------------------------------------
    // Save one metric
    // --------------------------------------------------

    public EnergyMetric createMetric(EnergyMetric metric) {
        return repository.save(metric);
    }

    // --------------------------------------------------
    // Save multiple metrics
    // --------------------------------------------------

    public List<EnergyMetric> createMetrics(
            List<EnergyMetric> metrics) {

        return repository.saveAll(metrics);
    }

    // --------------------------------------------------
    // Get recent metrics
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public List<EnergyMetric> getRecentMetrics() {

        List<EnergyMetric> metrics =
                repository.findAll();

        if (metrics.size() > 10) {

            return metrics.subList(
                    Math.max(0, metrics.size() - 10),
                    metrics.size()
            );
        }

        return metrics;
    }

    // --------------------------------------------------
    // Get analytics
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public Map<String, Object> getAnalytics() {

        List<EnergyMetric> metrics =
                repository.findAll();

        // ----------------------------------------------
        // Total Generation
        // ----------------------------------------------

        BigDecimal totalGeneration =
                BigDecimal.ZERO;

        // ----------------------------------------------
        // Average Efficiency
        // ----------------------------------------------

        BigDecimal totalEfficiency =
                BigDecimal.ZERO;

        int efficiencyCount = 0;

        for (EnergyMetric metric : metrics) {

            if (metric.getEnergyGeneratedKwh() != null) {

                totalGeneration =
                        totalGeneration.add(
                                metric.getEnergyGeneratedKwh()
                        );
            }

            if (metric.getConversionEfficiency() != null) {

                totalEfficiency =
                        totalEfficiency.add(
                                metric.getConversionEfficiency()
                        );

                efficiencyCount++;
            }
        }

        double averageEfficiency = 0.0;

        if (efficiencyCount > 0) {

            averageEfficiency =
                    totalEfficiency.doubleValue()
                    / efficiencyCount;
        }

        // ----------------------------------------------
        // Active Panels
        // ----------------------------------------------

        int totalActivePanels =
                panelRepository
                        .findByStatus(PanelStatus.ACTIVE)
                        .size();

        // ----------------------------------------------
        // Open Tickets
        // ----------------------------------------------

        int openTickets =
                ticketRepository
                        .findByStatus(TicketStatus.OPEN)
                        .size();

        // ----------------------------------------------
        // Panels Under Maintenance
        // ----------------------------------------------

        int maintenancePanels =
                panelRepository
                        .findByStatus(
                                PanelStatus.UNDER_MAINTENANCE
                        )
                        .size();

        // ----------------------------------------------
        // Build Analytics Response
        // ----------------------------------------------

        Map<String, Object> analytics =
                new HashMap<>();

        analytics.put(
                "totalGeneration",
                totalGeneration
        );

        /*
         * EnergyMetric currently does not contain
         * an energy consumption field.
         */
        analytics.put(
                "totalConsumption",
                BigDecimal.ZERO
        );

        analytics.put(
                "efficiencyRatio",
                averageEfficiency
        );

        analytics.put(
                "totalMetrics",
                metrics.size()
        );

        analytics.put(
                "totalActivePanels",
                totalActivePanels
        );

        analytics.put(
                "openTickets",
                openTickets
        );

        analytics.put(
                "maintenancePanels",
                maintenancePanels
        );

        return analytics;
    }

    // --------------------------------------------------
    // Get metrics by panel
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public List<EnergyMetric> getMetricsByPanel(
            Long panelId) {

        return repository.findByPanelId(panelId);
    }

    // --------------------------------------------------
    // Get metrics between dates
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public List<EnergyMetric> getMetricsBetween(
            LocalDateTime start,
            LocalDateTime end) {

        return repository.findByReadingTimestampBetween(
                start,
                end
        );
    }
}