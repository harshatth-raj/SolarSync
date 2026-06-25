package com.example.demo.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.service.AuthService;


@RestController

public class UserController {
    public final AuthService service;
    
    public UserController(AuthService service){
        this.service=service;
    }

    @PostMapping
    public SystemUser createUser(@RequestBody RegisterDto dto){
        return service.createUser(dto);
    }
}
