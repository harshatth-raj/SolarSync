package com.example.demo.dto;

import com.example.demo.enums.Priority;
import com.example.demo.enums.TicketStatus;

import java.time.LocalDateTime;

public class TicketResponseDto {

    private Long id;
    private Long panelId;
    private String siteName;
    private String issueDescription;
    private Priority priority;
    private TicketStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String assignedTechnician;

    public TicketResponseDto() {}

    public TicketResponseDto(Long id, Long panelId, String siteName,
                              String issueDescription, Priority priority,
                              TicketStatus status, LocalDateTime createdAt,
                              LocalDateTime resolvedAt, String assignedTechnician) {
        this.id = id;
        this.panelId = panelId;
        this.siteName = siteName;
        this.issueDescription = issueDescription;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
        this.assignedTechnician = assignedTechnician;
    }

    public Long getId() { return id; }
    public Long getPanelId() { return panelId; }
    public String getSiteName() { return siteName; }
    public String getIssueDescription() { return issueDescription; }
    public Priority getPriority() { return priority; }
    public TicketStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public String getAssignedTechnician() { return assignedTechnician; }

    public void setId(Long id) { this.id = id; }
    public void setPanelId(Long panelId) { this.panelId = panelId; }
    public void setSiteName(String siteName) { this.siteName = siteName; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public void setAssignedTechnician(String assignedTechnician) { this.assignedTechnician = assignedTechnician; }
}
