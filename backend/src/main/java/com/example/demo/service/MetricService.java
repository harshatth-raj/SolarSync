package com.example.demo.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
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
    // DAILY ENERGY
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public BigDecimal getDailyEnergy() {

        LocalDateTime startOfDay =
                LocalDate.now().atStartOfDay();

        LocalDateTime endOfDay =
                LocalDate.now().plusDays(1).atStartOfDay();

        List<EnergyMetric> metrics =
                repository.findByReadingTimestampBetween(
                        startOfDay,
                        endOfDay
                );

        BigDecimal total =
                BigDecimal.ZERO;

        for (EnergyMetric metric : metrics) {

            if (metric.getEnergyGeneratedKwh() != null) {

                total = total.add(
                        metric.getEnergyGeneratedKwh()
                );
            }
        }

        return total.setScale(
                2,
                RoundingMode.HALF_UP
        );
    }

    // --------------------------------------------------
    // SYSTEM EFFICIENCY
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public BigDecimal getEfficiency() {

        LocalDateTime startOfDay =
                LocalDate.now().atStartOfDay();

        LocalDateTime endOfDay =
                LocalDate.now().plusDays(1).atStartOfDay();

        List<EnergyMetric> metrics =
                repository.findByReadingTimestampBetween(
                        startOfDay,
                        endOfDay
                );

        BigDecimal totalEfficiency =
                BigDecimal.ZERO;

        int count = 0;

        for (EnergyMetric metric : metrics) {

            if (metric.getConversionEfficiency() != null) {

                totalEfficiency =
                        totalEfficiency.add(
                                metric.getConversionEfficiency()
                        );

                count++;
            }
        }

        if (count == 0) {
            return BigDecimal.ZERO.setScale(
                    1,
                    RoundingMode.HALF_UP
            );
        }

        return totalEfficiency
                .divide(
                        BigDecimal.valueOf(count),
                        1,
                        RoundingMode.HALF_UP
                );
    }

    // --------------------------------------------------
    // MAINTENANCE COST
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public BigDecimal getMaintenanceCost() {

        /*
         * EnergyMetric does not currently contain
         * maintenance cost information.
         *
         * Therefore we keep the existing dashboard
         * value instead of inventing a calculation.
         */
        return new BigDecimal("3.00");
    }

    // --------------------------------------------------
    // GET ANALYTICS
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

        BigDecimal averageEfficiency =
                BigDecimal.ZERO;

        if (efficiencyCount > 0) {

            averageEfficiency =
                    totalEfficiency.divide(
                            BigDecimal.valueOf(
                                    efficiencyCount
                            ),
                            2,
                            RoundingMode.HALF_UP
                    );
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
                                PanelStatus.MAINTENANCE
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
    // GET METRICS BY PANEL
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public List<EnergyMetric> getMetricsByPanel(
            Long panelId) {

        return repository.findByPanelId(panelId);
    }

    // --------------------------------------------------
    // GET METRICS BETWEEN DATES
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