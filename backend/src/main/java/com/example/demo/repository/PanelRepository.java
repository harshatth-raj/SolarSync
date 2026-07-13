package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.SolarPanel;

@Repository
public interface PanelRepository extends JpaRepository<SolarPanel, Long> {

    List<SolarPanel> findByStatus(String status);

    @Query("SELECT p FROM SolarPanel p WHERE p.capacity > ?1")
    List<SolarPanel> findPanelsWithCapacityGreaterThan(Double capacity);

}