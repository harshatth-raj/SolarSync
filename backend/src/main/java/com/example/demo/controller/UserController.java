package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.dto.RegisterDto;
import com.example.demo.service.AuthService;

public class UserController {
    public final AuthService service;
    
    public UserController(AuthService service){
        this.service=service;
    }

    public SystemUser createUser(@RequestBody RegisterDto dto){
        return service
    }
}
