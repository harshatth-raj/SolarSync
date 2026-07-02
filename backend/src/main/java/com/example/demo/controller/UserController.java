package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.service.AuthService;


@RestController
@RequestMapping("/api/user")
public class UserController {
    public final AuthService service;
    
    public UserController(AuthService service){
        this.service=service;
    }

    @PostMapping("register")
    public SystemUser createUser(@RequestBody RegisterDto dto){
        return service.createUser(dto);
    }

    
    @GetMapping
    public ResponseEntity<List<SystemUser>>getAllUsers(){
        List<SystemUser>users=service.getAllUsers();
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SystemUser>getUser(@PathVariable Long id ){
        SystemUser user =service.getUser(id);
            return ResponseEntity.status(HttpStatus.OK).body(user);

    }

    @PutMapping("/{id}")
    public ResponseEntity<SystemUser> UpdateUser(@PathVariable Long id ,@RequestBody RegisterDto dto){
        SystemUser user = service.UpdateUser(id,dto);

        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    
   @DeleteMapping("/{id}")
    public ResponseEntity<String>DeleteUser(@PathVariable Long id){
        service.DeleteUser(id);
        return ResponseEntity.status(HttpStatus.OK).body("User deleted Successfully");

    }
}
