package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "solar_panels")
public class SolarPanel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String panelSerialNumber;

    @Column(nullable = false)
    private Double capacity;

    @NotBlank
    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "site_id", nullable = false)
    private SolarSite site;

    public SolarPanel() {
    }

    public SolarPanel(Long id, String panelSerialNumber, Double capacity, String status, SolarSite site) {
        this.id = id;
        this.panelSerialNumber = panelSerialNumber;
        this.capacity = capacity;
        this.status = status;
        this.site = site;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPanelSerialNumber() {
        return panelSerialNumber;
    }

    public void setPanelSerialNumber(String panelSerialNumber) {
        this.panelSerialNumber = panelSerialNumber;
    }

    public Double getCapacity() {
        return capacity;
    }

    public void setCapacity(Double capacity) {
        this.capacity = capacity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public SolarSite getSite() {
        return site;
    }

    public void setSite(SolarSite site) {
        this.site = site;
    }
}