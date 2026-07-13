package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.SolarSite;
import com.example.demo.repository.SiteRepository;

@Service
@Transactional
public class SiteService {

    private final SiteRepository repository;

    public SiteService(SiteRepository repository) {
        this.repository = repository;
    }

    public SolarSite createSite(SolarSite site) {
        return repository.save(site);
    }

    @Transactional(readOnly = true)
    public List<SolarSite> getAllSites() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public SolarSite getSiteById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Site not found"));
    }

    public SolarSite updateSite(Long id, SolarSite updatedSite) {
        SolarSite site = getSiteById(id);

        site.setSiteName(updatedSite.getSiteName());
        site.setLocation(updatedSite.getLocation());
        site.setCapacity(updatedSite.getCapacity());

        return repository.save(site);
    }

    public void deleteSite(Long id) {
        SolarSite site = getSiteById(id);
        repository.delete(site);
    }
}