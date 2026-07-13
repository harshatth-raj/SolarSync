package com.example.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "energy_metrics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnergyMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "panel_id", nullable = false)
    @JsonBackReference
    private SolarPanel panel;

    @Column(name = "reading_timestamp", nullable = false)
    private LocalDateTime readingTimestamp;

    @Column(
            name = "energy_generated_kwh",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal energyGeneratedKwh;

    @Column(
            name = "panel_temperature",
            precision = 5,
            scale = 2
    )
    private BigDecimal panelTemperature;

    @Column(
            name = "solar_irradiance",
            precision = 8,
            scale = 2
    )
    private BigDecimal solarIrradiance;

    @Column(
            name = "conversion_efficiency",
            precision = 5,
            scale = 2
    )
    private BigDecimal conversionEfficiency;
}