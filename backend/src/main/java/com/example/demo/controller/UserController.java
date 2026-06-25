package com.example.demo.controller;

import com.example.demo.service.AuthService;

public class UserController {
    public final AuthService service;
    
    public UserController(AuthService service){
        this.service=service;
    }

    
}
