package com.example.demo.dto;

import java.util.List;

public class MetricBatchDto {

    private List<Long> panelIds;

    public MetricBatchDto() {
    }

    public MetricBatchDto(List<Long> panelIds) {
        this.panelIds = panelIds;
    }

    public List<Long> getPanelIds() {
        return panelIds;
    }

    public void setPanelIds(List<Long> panelIds) {
        this.panelIds = panelIds;
    }
}