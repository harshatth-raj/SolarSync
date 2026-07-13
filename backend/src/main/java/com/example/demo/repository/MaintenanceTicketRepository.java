package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.MaintenanceTicket;
import com.example.demo.enums.TicketStatus;

@Repository
public interface MaintenanceTicketRepository
        extends JpaRepository<MaintenanceTicket, Long> {

    List<MaintenanceTicket> findByStatus(TicketStatus status);

    List<MaintenanceTicket> findByAssignedTechnicianId(Long technicianId);

    List<MaintenanceTicket> findByPanelId(Long panelId);

}