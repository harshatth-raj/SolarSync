package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.SolarPanel;
import com.example.demo.entity.SolarSite;
import com.example.demo.repository.SolarPanelRepository;
import com.example.demo.repository.SolarSiteRepository;

@Service
@Transactional
public class SiteManagementService {

    private final SolarSiteRepository siteRepository;
    private final SolarPanelRepository panelRepository;

    public SiteManagementService(SolarSiteRepository siteRepository,
                                 SolarPanelRepository panelRepository) {
        this.siteRepository = siteRepository;
        this.panelRepository = panelRepository;
    }

    // -----------------------------
    // Site Operations
    // -----------------------------

    public SolarSite createSite(SolarSite site) {
        return siteRepository.save(site);
    }

    @Transactional(readOnly = true)
    public List<SolarSite> getAllSites() {
        return siteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public SolarSite getSiteById(Long id) {
        return siteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Site not found"));
    }

    public SolarSite updateSite(Long id, SolarSite updatedSite) {

        SolarSite site = getSiteById(id);

        site.setSiteName(updatedSite.getSiteName());
        site.setLocationCoordinates(updatedSite.getLocationCoordinates());
        site.setRatedCapacityKw(updatedSite.getRatedCapacityKw());
        site.setCommissionDate(updatedSite.getCommissionDate());

        return siteRepository.save(site);
    }

    public void deleteSite(Long id) {

        SolarSite site = getSiteById(id);

        siteRepository.delete(site);
    }

    // -----------------------------
    // Panel Operations
    // -----------------------------

    public SolarPanel createPanel(SolarPanel panel) {
        return panelRepository.save(panel);
    }

    @Transactional(readOnly = true)
    public List<SolarPanel> getAllPanels() {
        return panelRepository.findAll();
    }

    @Transactional(readOnly = true)
    public SolarPanel getPanelById(Long id) {
        return panelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Panel not found"));
    }

    public SolarPanel updatePanel(Long id, SolarPanel updatedPanel) {

        SolarPanel panel = getPanelById(id);

        panel.setSerialNumber(updatedPanel.getSerialNumber());
        panel.setModelType(updatedPanel.getModelType());
        panel.setStatus(updatedPanel.getStatus());
        panel.setInstallationDate(updatedPanel.getInstallationDate());

        return panelRepository.save(panel);
    }

    public void deletePanel(Long id) {

        SolarPanel panel = getPanelById(id);

        panelRepository.delete(panel);
    }
}