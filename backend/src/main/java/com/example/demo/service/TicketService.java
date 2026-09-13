package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.TicketRequestDto;
import com.example.demo.dto.TicketResponseDto;
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
    public List<TicketResponseDto> getAllTickets() {

        List<MaintenanceTicket> tickets = ticketRepository.findAll();
        List<TicketResponseDto> result = new java.util.ArrayList<>();

        for (MaintenanceTicket ticket : tickets) {
            Long panelId = null;
            String siteName = null;

            if (ticket.getPanel() != null) {
                panelId = ticket.getPanel().getId();
                if (ticket.getPanel().getSite() != null) {
                    siteName = ticket.getPanel().getSite().getSiteName();
                }
            }

            String techName = null;
            if (ticket.getAssignedTechnician() != null) {
                techName = ticket.getAssignedTechnician().getUsername();
            }

            result.add(new TicketResponseDto(
                ticket.getId(),
                panelId,
                siteName,
                ticket.getIssueDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreatedAt(),
                ticket.getResolvedAt(),
                techName
            ));
        }

        return result;
    }

    // --------------------------------------------------
    // CREATE TICKET
    // --------------------------------------------------

    public TicketResponseDto createTicket(TicketRequestDto dto) {

        SolarPanel panel =
                panelRepository.findById(dto.getPanelId())
                        .orElseThrow(() -> new RuntimeException("Panel not found"));

        MaintenanceTicket ticket = new MaintenanceTicket();
        ticket.setPanel(panel);
        ticket.setIssueDescription(dto.getIssueDescription());
        ticket.setPriority(dto.getPriority());
        ticket.setStatus(com.example.demo.enums.TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());

        if (dto.getTechnicianId() != null) {
            SystemUser technician = userRepository.findById(dto.getTechnicianId())
                    .orElseThrow(() -> new RuntimeException("Technician not found"));
            ticket.setAssignedTechnician(technician);
        }

        ticketRepository.save(ticket);

        String siteName = (panel.getSite() != null) ? panel.getSite().getSiteName() : null;
        String techName = (ticket.getAssignedTechnician() != null)
                ? ticket.getAssignedTechnician().getUsername() : null;

        return new TicketResponseDto(
                ticket.getId(), panel.getId(), siteName,
                ticket.getIssueDescription(), ticket.getPriority(),
                ticket.getStatus(), ticket.getCreatedAt(),
                ticket.getResolvedAt(), techName);
    }

    // --------------------------------------------------
    // ASSIGN TICKET
    // --------------------------------------------------

    public TicketResponseDto assignTicket(
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

        ticket.setAssignedTechnician(technician);
        ticket.setStatus(com.example.demo.enums.TicketStatus.IN_PROGRESS);
        ticketRepository.save(ticket);

        Long panelId = ticket.getPanel() != null ? ticket.getPanel().getId() : null;
        String siteName = (ticket.getPanel() != null && ticket.getPanel().getSite() != null)
                ? ticket.getPanel().getSite().getSiteName() : null;

        return new TicketResponseDto(
                ticket.getId(), panelId, siteName,
                ticket.getIssueDescription(), ticket.getPriority(),
                ticket.getStatus(), ticket.getCreatedAt(),
                ticket.getResolvedAt(), technician.getUsername());
    }

    // --------------------------------------------------
    // RESOLVE / CLOSE TICKET
    // --------------------------------------------------

    public TicketResponseDto resolveTicket(
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

        ticketRepository.save(ticket);

        Long panelId = ticket.getPanel() != null ? ticket.getPanel().getId() : null;
        String siteName = (ticket.getPanel() != null && ticket.getPanel().getSite() != null)
                ? ticket.getPanel().getSite().getSiteName() : null;
        String techName = ticket.getAssignedTechnician() != null
                ? ticket.getAssignedTechnician().getUsername() : null;

        return new TicketResponseDto(
                ticket.getId(), panelId, siteName,
                ticket.getIssueDescription(), ticket.getPriority(),
                ticket.getStatus(), ticket.getCreatedAt(),
                ticket.getResolvedAt(), techName);
    }
}