package com.example.demo.service;

import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.SystemUserRepository;

public class AuthService {
    public final SystemUserRepository repo;

    public AuthService(SystemUserRepository repo){
        this.repo=repo;

    }

    public SystemUser createUser(RegisterDto dto){
        SystemUser user =new SystemUser();
    }
 
}
