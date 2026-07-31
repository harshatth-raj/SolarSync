package com.example.demo.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.enums.PanelStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "solar_panels")
public class SolarPanel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "site_id", nullable = false)
    @JsonBackReference
    private SolarSite site;

    @Column(name = "serial_number", unique = true, nullable = false)
    private String serialNumber;

    @Column(name = "model_type", nullable = false)
    private String modelType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PanelStatus status;

    @Column(name = "installation_date", nullable = false)
    private LocalDate installationDate;

    @Column(name = "usage_count", nullable = false)
    private int usageCount = 0;

    @OneToMany(
            mappedBy = "panel",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonIgnore
    private List<EnergyMetric> metrics = new ArrayList<>();

    @OneToMany(
            mappedBy = "panel",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonIgnore
    private List<MaintenanceTicket> tickets = new ArrayList<>();

    public SolarPanel() {
    }

    public SolarPanel(Long id,
                      SolarSite site,
                      String serialNumber,
                      String modelType,
                      PanelStatus status,
                      LocalDate installationDate,
                      int usageCount,
                      List<EnergyMetric> metrics,
                      List<MaintenanceTicket> tickets) {

        this.id = id;
        this.site = site;
        this.serialNumber = serialNumber;
        this.modelType = modelType;
        this.status = status;
        this.installationDate = installationDate;
        this.usageCount = usageCount;
        this.metrics = metrics;
        this.tickets = tickets;
    }

    // --------------------
    // Getters
    // --------------------

    public Long getId() {
        return id;
    }

    public SolarSite getSite() {
        return site;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public String getModelType() {
        return modelType;
    }

    public PanelStatus getStatus() {
        return status;
    }

    public LocalDate getInstallationDate() {
        return installationDate;
    }

    public int getUsageCount() {
        return usageCount;
    }

    public List<EnergyMetric> getMetrics() {
        return metrics;
    }

    public List<MaintenanceTicket> getTickets() {
        return tickets;
    }

    // --------------------
    // Setters
    // --------------------

    public void setId(Long id) {
        this.id = id;
    }

    public void setSite(SolarSite site) {
        this.site = site;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public void setModelType(String modelType) {
        this.modelType = modelType;
    }

    public void setStatus(PanelStatus status) {
        this.status = status;
    }

    public void setInstallationDate(LocalDate installationDate) {
        this.installationDate = installationDate;
    }

    public void setUsageCount(int usageCount) {
        this.usageCount = usageCount;
    }

    public void setMetrics(List<EnergyMetric> metrics) {
        this.metrics = metrics;
    }

    public void setTickets(List<MaintenanceTicket> tickets) {
        this.tickets = tickets;
    }

    public Object getCapacity() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getCapacity'");
    }

    public void setCapacity(Object capacity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setCapacity'");
    }
}   