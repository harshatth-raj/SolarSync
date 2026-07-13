package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.SolarPanel;
import com.example.demo.repository.PanelRepository;

@Service
@Transactional
public class PanelService {

    private final PanelRepository repository;

    public PanelService(PanelRepository repository) {
        this.repository = repository;
    }

    public SolarPanel createPanel(SolarPanel panel) {
        return repository.save(panel);
    }

    @Transactional(readOnly = true)
    public List<SolarPanel> getAllPanels() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public SolarPanel getPanelById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Panel not found"));
    }

    public SolarPanel updatePanel(Long id, SolarPanel updatedPanel) {

        SolarPanel panel = getPanelById(id);

        panel.setPanelSerialNumber(updatedPanel.getPanelSerialNumber());
        panel.setCapacity(updatedPanel.getCapacity());
        panel.setStatus(updatedPanel.getStatus());
        panel.setSite(updatedPanel.getSite());

        return repository.save(panel);
    }

    public void deletePanel(Long id) {
        SolarPanel panel = getPanelById(id);
        repository.delete(panel);
    }
}