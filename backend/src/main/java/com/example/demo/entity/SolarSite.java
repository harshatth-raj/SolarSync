package com.example.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "solar_sites")
public class SolarSite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_name", unique = true, nullable = false)
    private String siteName;

    @Column(name = "location_coordinates", nullable = false)
    private String locationCoordinates;

    @Column(name = "rated_capacity_kw", nullable = false)
    private BigDecimal ratedCapacityKw;

    @Column(name = "commission_date", nullable = false)
    private LocalDate commissionDate;

    @Transient
    private BigDecimal currentGeneration;

    @OneToMany(
            mappedBy = "site",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JsonManagedReference
    private List<SolarPanel> panels = new ArrayList<>();

    public SolarSite() {
    }

    public SolarSite(Long id,
                     String siteName,
                     String locationCoordinates,
                     BigDecimal ratedCapacityKw,
                     LocalDate commissionDate,
                     BigDecimal currentGeneration,
                     List<SolarPanel> panels) {

        this.id = id;
        this.siteName = siteName;
        this.locationCoordinates = locationCoordinates;
        this.ratedCapacityKw = ratedCapacityKw;
        this.commissionDate = commissionDate;
        this.currentGeneration = currentGeneration;
        this.panels = panels;
    }

    // -----------------------------
    // Getters
    // -----------------------------

    public Long getId() {
        return id;
    }

    public String getSiteName() {
        return siteName;
    }

    public String getLocationCoordinates() {
        return locationCoordinates;
    }

    public BigDecimal getRatedCapacityKw() {
        return ratedCapacityKw;
    }

    public LocalDate getCommissionDate() {
        return commissionDate;
    }

    public BigDecimal getCurrentGeneration() {
        return currentGeneration;
    }

    public List<SolarPanel> getPanels() {
        return panels;
    }

    // -----------------------------
    // Setters
    // -----------------------------

    public void setId(Long id) {
        this.id = id;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public void setLocationCoordinates(String locationCoordinates) {
        this.locationCoordinates = locationCoordinates;
    }

    public void setRatedCapacityKw(BigDecimal ratedCapacityKw) {
        this.ratedCapacityKw = ratedCapacityKw;
    }

    public void setCommissionDate(LocalDate commissionDate) {
        this.commissionDate = commissionDate;
    }

    public void setCurrentGeneration(BigDecimal currentGeneration) {
        this.currentGeneration = currentGeneration;
    }

    public void setPanels(List<SolarPanel> panels) {
        this.panels = panels;
    }

}