package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.SolarSite;

@Repository
public interface SolarSiteRepository
        extends JpaRepository<SolarSite, Long> {

    Optional<SolarSite> findBySiteName(String siteName);

    @Query("""
           SELECT SUM(s.ratedCapacityKw)
           FROM SolarSite s
           """)
    Double getTotalInstalledCapacity();

}