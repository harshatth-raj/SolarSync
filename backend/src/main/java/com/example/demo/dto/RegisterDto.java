package com.example.demo.dto;

import com.example.demo.enums.Role;

public class RegisterDto {
    private String username;
    private String password;
    private String email;
    private Role user;

    public RegisterDto(String username,String password,String email,Role user ){
       this.username=username;
       this.password=password;
       this.email=email;
       
}

}
