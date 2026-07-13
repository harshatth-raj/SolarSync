package com.example.demo.dto;

import com.example.demo.enums.Priority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TicketRequestDto {

    @NotNull(message = "Panel ID is required")
    private Long panelId;

    @NotBlank(message = "Issue description is required")
    private String issueDescription;

    @NotNull(message = "Priority is required")
    private Priority priority;

    public TicketRequestDto() {
    }

    public Long getPanelId() {
        return panelId;
    }

    public void setPanelId(Long panelId) {
        this.panelId = panelId;
    }

    public String getIssueDescription() {
        return issueDescription;
    }

    public void setIssueDescription(String issueDescription) {
        this.issueDescription = issueDescription;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }
}