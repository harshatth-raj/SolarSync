package com.example.demo.entity;

import com.example.demo.enums.Role;

import jakarta.persistence.*;

@Entity
@Table(name="system_users")

public class SystemUser{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)


        @Column(unique= true)
    private Long id;


    private String username;
    private String password;
    private String email;


       public SystemUser(){


    }

    public SystemUser(Long id,String username,String password,String email,Role user){
         this.id=id;
         this.username=username;
         this.password=password;
         this.email=email;
         this.user=user;

    }

    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id=id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getUser() {
        return user;
    }

    public void setUser(Role user) {
        this.user = user;
    }
    
    @Enumerated(EnumType.STRING)
    private Role user;


 

    
    
}