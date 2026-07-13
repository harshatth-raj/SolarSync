package com.example.demo.dto;

import com.example.demo.enums.PanelStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PanelDto {

    @NotBlank
    private String serialNumber;

    @NotBlank
    private String modelType;

    @NotNull
    private PanelStatus status;

    @NotNull
    private Long siteId;

    public PanelDto() {
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getModelType() {
        return modelType;
    }

    public void setModelType(String modelType) {
        this.modelType = modelType;
    }

    public PanelStatus getStatus() {
        return status;
    }

    public void setStatus(PanelStatus status) {
        this.status = status;
    }

    public Long getSiteId() {
        return siteId;
    }

    public void setSiteId(Long siteId) {
        this.siteId = siteId;
    }
}