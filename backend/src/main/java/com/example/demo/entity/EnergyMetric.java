package com.example.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "energy_metrics")
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

    // --------------------
    // Constructors
    // --------------------

    public EnergyMetric() {
    }

    public EnergyMetric(
            Long id,
            SolarPanel panel,
            LocalDateTime readingTimestamp,
            BigDecimal energyGeneratedKwh,
            BigDecimal panelTemperature,
            BigDecimal solarIrradiance,
            BigDecimal conversionEfficiency) {

        this.id = id;
        this.panel = panel;
        this.readingTimestamp = readingTimestamp;
        this.energyGeneratedKwh = energyGeneratedKwh;
        this.panelTemperature = panelTemperature;
        this.solarIrradiance = solarIrradiance;
        this.conversionEfficiency = conversionEfficiency;
    }

    // --------------------
    // Getters
    // --------------------

    public Long getId() {
        return id;
    }

    public SolarPanel getPanel() {
        return panel;
    }

    public LocalDateTime getReadingTimestamp() {
        return readingTimestamp;
    }

    public BigDecimal getEnergyGeneratedKwh() {
        return energyGeneratedKwh;
    }

    public BigDecimal getPanelTemperature() {
        return panelTemperature;
    }

    public BigDecimal getSolarIrradiance() {
        return solarIrradiance;
    }

    public BigDecimal getConversionEfficiency() {
        return conversionEfficiency;
    }

    // --------------------
    // Setters
    // --------------------

    public void setId(Long id) {
        this.id = id;
    }

    public void setPanel(SolarPanel panel) {
        this.panel = panel;
    }

    public void setReadingTimestamp(LocalDateTime readingTimestamp) {
        this.readingTimestamp = readingTimestamp;
    }

    public void setEnergyGeneratedKwh(BigDecimal energyGeneratedKwh) {
        this.energyGeneratedKwh = energyGeneratedKwh;
    }

    public void setPanelTemperature(BigDecimal panelTemperature) {
        this.panelTemperature = panelTemperature;
    }

    public void setSolarIrradiance(BigDecimal solarIrradiance) {
        this.solarIrradiance = solarIrradiance;
    }

    public void setConversionEfficiency(BigDecimal conversionEfficiency) {
        this.conversionEfficiency = conversionEfficiency;
    }
}