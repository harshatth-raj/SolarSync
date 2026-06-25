package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.SystemUser;

public interface SystemUserRepository extends JpaRepository<SystemUser, Long> {
    
}
