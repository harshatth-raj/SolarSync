package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.EnergyMetric;

@Repository
public interface EnergyMetricRepository extends JpaRepository<EnergyMetric, Long> {

    List<EnergyMetric> findByPanelId(Long panelId);

    List<EnergyMetric> findByReadingTimestampBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("""
           SELECT AVG(e.conversionEfficiency)
           FROM EnergyMetric e
           WHERE e.panel.id = :panelId
           """)
    Double getAverageEfficiency(Long panelId);

}