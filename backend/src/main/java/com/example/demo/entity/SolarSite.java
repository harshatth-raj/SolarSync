package com.example.demo.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "solar_sites")
public class SolarSite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String siteName;

    @NotBlank
    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Double capacity;

    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SolarPanel> panels = new ArrayList<>();

    public SolarSite() {
    }

    public SolarSite(Long id, String siteName, String location, Double capacity) {
        this.id = id;
        this.siteName = siteName;
        this.location = location;
        this.capacity = capacity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id=id;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName=siteName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location=location;
    }

    public Double getCapacity() {
        return capacity;
    }

    public void setCapacity(Double capacity) {
        this.capacity=capacity;
    }

    public List<SolarPanel> getPanels() {
        return panels;
    }

    public void setPanels(List<SolarPanel> panels) {
        this.panels=panels;
    }
}