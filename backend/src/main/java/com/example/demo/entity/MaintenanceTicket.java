package com.example.demo.entity;

import java.time.LocalDateTime;

import com.example.demo.enums.Priority;
import com.example.demo.enums.TicketStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "maintenance_tickets")
public class MaintenanceTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "panel_id", nullable = false)
    @JsonBackReference
    private SolarPanel panel;

    @Column(name = "issue_description", nullable = false, length = 1000)
    private String issueDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.OPEN;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private SystemUser assignedTechnician;

    // -------------------------
    // Constructors
    // -------------------------

    public MaintenanceTicket() {
    }

    public MaintenanceTicket(
            Long id,
            SolarPanel panel,
            String issueDescription,
            Priority priority,
            TicketStatus status,
            LocalDateTime createdAt,
            LocalDateTime resolvedAt,
            SystemUser assignedTechnician) {

        this.id = id;
        this.panel = panel;
        this.issueDescription = issueDescription;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
        this.assignedTechnician = assignedTechnician;
    }

    // -------------------------
    // Getters
    // -------------------------

    public Long getId() {
        return id;
    }

    public SolarPanel getPanel() {
        return panel;
    }

    public String getIssueDescription() {
        return issueDescription;
    }

    public Priority getPriority() {
        return priority;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public SystemUser getAssignedTechnician() {
        return assignedTechnician;
    }

    // -------------------------
    // Setters
    // -------------------------

    public void setId(Long id) {
        this.id = id;
    }

    public void setPanel(SolarPanel panel) {
        this.panel = panel;
    }

    public void setIssueDescription(String issueDescription) {
        this.issueDescription = issueDescription;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public void setAssignedTechnician(SystemUser assignedTechnician) {
        this.assignedTechnician = assignedTechnician;
    }
}