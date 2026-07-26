package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.SolarPanel;

public interface PanelServiceInterface {
    SolarPanel createPanel(SolarPanel panel);
    List<SolarPanel> getAllPanels();
    SolarPanel getPanelById(Long id);
    SolarPanel updatePanel(Long id, SolarPanel panel);
    void deletePanel(Long id);
}
