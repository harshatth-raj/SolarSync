package com.example.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "solar_sites")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolarSite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "site_name",
            unique = true,
            nullable = false
    )
    private String siteName;

    @Column(
            name = "location_coordinates",
            nullable = false
    )
    private String locationCoordinates;

    @Column(
            name = "rated_capacity_kw",
            nullable = false
    )
    private BigDecimal ratedCapacityKw;

    @Column(
            name = "commission_date",
            nullable = false
    )
    private LocalDate commissionDate;

    @Transient
    private BigDecimal currentGeneration;

    @OneToMany(
            mappedBy = "site",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JsonManagedReference
    @Builder.Default
    private List<SolarPanel> panels = new ArrayList<>();

}