package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.SolarPanel;
import com.example.demo.enums.PanelStatus;

@Repository
public interface SolarPanelRepository
        extends JpaRepository<SolarPanel, Long> {

    Optional<SolarPanel> findBySerialNumber(String serialNumber);

    List<SolarPanel> findByStatus(PanelStatus status);

    List<SolarPanel> findBySiteId(Long siteId);

}