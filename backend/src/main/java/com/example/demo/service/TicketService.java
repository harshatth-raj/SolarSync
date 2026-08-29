package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.TicketRequestDto;
import com.example.demo.entity.MaintenanceTicket;
import com.example.demo.entity.SolarPanel;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.MaintenanceTicketRepository;
import com.example.demo.repository.SolarPanelRepository;
import com.example.demo.repository.SystemUserRepository;

@Service
@Transactional
public class TicketService {

    private final MaintenanceTicketRepository ticketRepository;
    private final SolarPanelRepository panelRepository;
    private final SystemUserRepository userRepository;

    public TicketService(
            MaintenanceTicketRepository ticketRepository,
            SolarPanelRepository panelRepository,
            SystemUserRepository userRepository) {

        this.ticketRepository = ticketRepository;
        this.panelRepository = panelRepository;
        this.userRepository = userRepository;
    }

    // --------------------------------------------------
    // GET ALL TICKETS
    // --------------------------------------------------

    @Transactional(readOnly = true)
    public List<MaintenanceTicket> getAllTickets() {

        return ticketRepository.findAll();
    }

    // --------------------------------------------------
    // CREATE TICKET
    // --------------------------------------------------

    public MaintenanceTicket createTicket(
            TicketRequestDto dto) {

        SolarPanel panel =
                panelRepository.findById(dto.getPanelId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Panel not found"));

        MaintenanceTicket ticket =
                new MaintenanceTicket();

        ticket.setPanel(panel);

        ticket.setIssueDescription(
                dto.getIssueDescription());

        ticket.setPriority(
                dto.getPriority());

        ticket.setStatus(
                com.example.demo.enums.TicketStatus.OPEN);

        ticket.setCreatedAt(
                LocalDateTime.now());

        // Assign technician if provided
        if (dto.getTechnicianId() != null) {

            SystemUser technician =
                    userRepository.findById(
                            dto.getTechnicianId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Technician not found"));

            ticket.setAssignedTechnician(
                    technician);
        }

        return ticketRepository.save(ticket);
    }

    // --------------------------------------------------
    // ASSIGN TICKET
    // --------------------------------------------------

    public MaintenanceTicket assignTicket(
            Long ticketId,
            Long technicianId) {

        MaintenanceTicket ticket =
                ticketRepository.findById(ticketId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket not found"));

        SystemUser technician =
                userRepository.findById(technicianId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Technician not found"));

        ticket.setAssignedTechnician(
                technician);

        ticket.setStatus(
                com.example.demo.enums.TicketStatus.IN_PROGRESS);

        return ticketRepository.save(ticket);
    }

    // --------------------------------------------------
    // RESOLVE / CLOSE TICKET
    // --------------------------------------------------

    public MaintenanceTicket resolveTicket(
            Long ticketId) {

        MaintenanceTicket ticket =
                ticketRepository.findById(ticketId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket not found"));

        ticket.setStatus(
                com.example.demo.enums.TicketStatus.CLOSED);

        ticket.setResolvedAt(
                LocalDateTime.now());

        return ticketRepository.save(ticket);
    }
}