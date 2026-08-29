package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.SolarPanel;
import com.example.demo.repository.SolarPanelRepository;

@Service
@Transactional
public class PanelService implements PanelServiceInterface {

    private final SolarPanelRepository repository;

    public PanelService(SolarPanelRepository repository) {
        this.repository = repository;
    }

    @Override
    public SolarPanel createPanel(SolarPanel panel) {
        return repository.save(panel);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SolarPanel> getAllPanels() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public SolarPanel getPanelById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Panel not found"));
    }

    // ⭐ NEW METHOD
    @Override
    @Transactional(readOnly = true)
    public List<SolarPanel> getPanelsBySite(Long siteId) {
        return repository.findBySiteId(siteId);
    }

    @Override
    public SolarPanel updatePanel(
            Long id,
            SolarPanel panel) {

        SolarPanel existingPanel =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Panel not found"));

        existingPanel.setSerialNumber(
                panel.getSerialNumber());

        existingPanel.setModelType(
                panel.getModelType());

        existingPanel.setStatus(
                panel.getStatus());

        existingPanel.setInstallationDate(
                panel.getInstallationDate());

        existingPanel.setUsageCount(
                panel.getUsageCount());

        existingPanel.setCapacity(
                panel.getCapacity());

        return repository.save(existingPanel);
    }

    @Override
    public void deletePanel(Long id) {

        SolarPanel panel =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Panel not found"));

        repository.delete(panel);
    }
}