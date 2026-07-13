package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SiteCreationDto {

    @NotBlank(message = "Site name is required")
    private String siteName;

    @NotBlank(message = "Location is required")
    private String locationCoordinates;

    @NotNull(message = "Rated capacity is required")
    private BigDecimal ratedCapacityKw;

    @NotNull(message = "Commission date is required")
    private LocalDate commissionDate;

    public SiteCreationDto() {
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getLocationCoordinates() {
        return locationCoordinates;
    }

    public void setLocationCoordinates(String locationCoordinates) {
        this.locationCoordinates = locationCoordinates;
    }

    public BigDecimal getRatedCapacityKw() {
        return ratedCapacityKw;
    }

    public void setRatedCapacityKw(BigDecimal ratedCapacityKw) {
        this.ratedCapacityKw = ratedCapacityKw;
    }

    public LocalDate getCommissionDate() {
        return commissionDate;
    }

    public void setCommissionDate(LocalDate commissionDate) {
        this.commissionDate = commissionDate;
    }
}