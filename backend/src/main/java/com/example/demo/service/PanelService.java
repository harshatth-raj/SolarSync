package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.SolarPanel;
import com.example.demo.repository.SolarPanelRepository;

@Service
public class PanelService implements PanelServiceInterface {

    private final SolarPanelRepository repository;

    public PanelService(SolarPanelRepository repository) {
        this.repository = repository;
    }

    @Transactional
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
                .orElseThrow(() -> new RuntimeException("Panel not found with id: " + id));
    }

    @Transactional
    public SolarPanel updatePanel(Long id, SolarPanel panel) {
        SolarPanel existing = getPanelById(id);
        existing.setPanelSerialNumber(panel.getPanelSerialNumber());
        existing.setCapacity(panel.getCapacity());
        existing.setStatus(panel.getStatus());
        return repository.save(existing);
    }

    @Transactional
    public void deletePanel(Long id) {
        repository.deleteById(id);
    }
}
