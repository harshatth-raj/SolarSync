package com.example.demo.dto;

public class EfficiencyReportDto {

    private Long panelId;
    private String panelSerialNumber;
    private Double efficiency;
    private Double energyGenerated;

    public EfficiencyReportDto() {
    }

    public EfficiencyReportDto(Long panelId,
                               String panelSerialNumber,
                               Double efficiency,
                               Double energyGenerated) {
        this.panelId = panelId;
        this.panelSerialNumber = panelSerialNumber;
        this.efficiency = efficiency;
        this.energyGenerated = energyGenerated;
    }

    public Long getPanelId() {
        return panelId;
    }

    public void setPanelId(Long panelId) {
        this.panelId = panelId;
    }

    public String getPanelSerialNumber() {
        return panelSerialNumber;
    }

    public void setPanelSerialNumber(String panelSerialNumber) {
        this.panelSerialNumber = panelSerialNumber;
    }

    public Double getEfficiency() {
        return efficiency;
    }

    public void setEfficiency(Double efficiency) {
        this.efficiency = efficiency;
    }

    public Double getEnergyGenerated() {
        return energyGenerated;
    }

    public void setEnergyGenerated(Double energyGenerated) {
        this.energyGenerated = energyGenerated;
    }
}