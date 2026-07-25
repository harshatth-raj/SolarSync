package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.SolarPanel;
import com.example.demo.entity.SolarSite;

public interface SiteManagementService {

    // Site Operations
    SolarSite createSite(SolarSite site);

    List<SolarSite> getAllSites();

    SolarSite getSiteById(Long id);

    SolarSite updateSite(Long id, SolarSite updatedSite);

    void deleteSite(Long id);

    // Panel Operations
    SolarPanel createPanel(SolarPanel panel);

    List<SolarPanel> getAllPanels();

    SolarPanel getPanelById(Long id);

    SolarPanel updatePanel(Long id, SolarPanel updatedPanel);

    void deletePanel(Long id);
}