package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MaintenanceService {

    public MaintenanceService() {
    }

    @Transactional
    public void reportMaintenance() {
        // Placeholder method for maintenance operations
    }
}