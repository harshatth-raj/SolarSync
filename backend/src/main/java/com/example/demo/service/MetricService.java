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
import com.example.demo.entity.MaintenanceTicket;
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
    // Create one metric
    // --------------------------------------------------

    public EnergyMetric createMetric(EnergyMetric metric) {
        return repository.save(metric);
    }

    // --------------------------------------------------
    // Create multiple metrics
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
    // Calculate Daily Energy
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public BigDecimal getDailyEnergy() {

        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay =
                today.atStartOfDay();

        LocalDateTime endOfDay =
                today.plusDays(1).atStartOfDay();

        List<EnergyMetric> metrics =
                repository.findByReadingTimestampBetween(
                        startOfDay,
                        endOfDay
                );

        BigDecimal totalEnergy =
                BigDecimal.ZERO;

        for (EnergyMetric metric : metrics) {

            if (metric.getEnergyGeneratedKwh() != null) {

                totalEnergy =
                        totalEnergy.add(
                                metric.getEnergyGeneratedKwh()
                        );
            }
        }

        return totalEnergy.setScale(
                2,
                RoundingMode.HALF_UP
        );
    }

    // --------------------------------------------------
    // Calculate System Efficiency
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public BigDecimal getSystemEfficiency() {

        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay =
                today.atStartOfDay();

        LocalDateTime endOfDay =
                today.plusDays(1).atStartOfDay();

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

        return totalEfficiency.divide(
                BigDecimal.valueOf(count),
                1,
                RoundingMode.HALF_UP
        );
    }

    // --------------------------------------------------
    // Calculate Maintenance Cost
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public BigDecimal getMaintenanceCost() {

        /*
         * There is currently no maintenance-cost field
         * in the database.
         *
         * Therefore, maintenance cost is not calculated
         * from imaginary data.
         *
         * This currently returns the existing dashboard
         * value of 3.00.
         */

        return new BigDecimal("3.00");
    }

    // --------------------------------------------------
    // Calculate all Dashboard Metrics
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardMetrics() {

        BigDecimal dailyEnergy =
                getDailyEnergy();

        BigDecimal systemEfficiency =
                getSystemEfficiency();

        BigDecimal maintenanceCost =
                getMaintenanceCost();

        Map<String, Object> result =
                new HashMap<>();

        result.put(
                "dailyEnergy",
                dailyEnergy
        );

        result.put(
                "systemEfficiency",
                systemEfficiency
        );

        result.put(
                "maintenanceCost",
                maintenanceCost
        );

        return result;
    }

    // --------------------------------------------------
    // Existing Analytics
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public Map<String, Object> getAnalytics() {

        List<EnergyMetric> metrics =
                repository.findAll();

        BigDecimal totalGeneration =
                BigDecimal.ZERO;

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

        int totalActivePanels =
                panelRepository
                        .findByStatus(PanelStatus.ACTIVE)
                        .size();

        int openTickets =
                ticketRepository
                        .findByStatus(TicketStatus.OPEN)
                        .size();

        int maintenancePanels =
                panelRepository
                        .findByStatus(PanelStatus.MAINTENANCE)
                        .size();

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
    // Get Metrics By Panel
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public List<EnergyMetric> getMetricsByPanel(
            Long panelId) {

        return repository.findByPanelId(panelId);
    }

    // --------------------------------------------------
    // Get Metrics Between Dates
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