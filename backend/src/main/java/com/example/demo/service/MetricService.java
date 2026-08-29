package com.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.EnergyMetric;
import com.example.demo.repository.EnergyMetricRepository;

@Service
@Transactional
public class MetricService {

    private final EnergyMetricRepository repository;

    public MetricService(EnergyMetricRepository repository) {
        this.repository = repository;
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

        // Return the latest 10 records
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

        double averageEfficiency = 0.0;

        if (efficiencyCount > 0) {

            averageEfficiency =
                    totalEfficiency
                            .doubleValue()
                    / efficiencyCount;
        }

        Map<String, Object> analytics =
                new HashMap<>();

        analytics.put(
                "totalGeneration",
                totalGeneration
        );

        /*
         * Your EnergyMetric entity currently does not
         * contain an energy consumption field.
         *
         * Therefore we return 0 instead of inventing
         * a consumption value.
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