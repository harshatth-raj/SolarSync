package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.SystemUserRepository;

@Service

public class AuthService {
    public final SystemUserRepository repo;

    public AuthService(SystemUserRepository repo){
        this.repo=repo;

    }

    public SystemUser createUser(RegisterDto dto){
        SystemUser user =new SystemUser();

        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setUsername(dto.getUsername());
        user.setUser(dto.getUser());

        return repo.save(user);

    }

    // public SystemUser getUser(Long id) {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'getUser'");
    // }

       public SystemUser UpdateUser(Long id,RegisterDto dto){
        SystemUser user=getUser(id);

        user.setUsername(dto.getUsername());
    
        user.setPassword(dto.getPassword());
        user.setEmail(dto.getEmail());
        user.setUser(dto.getUser());
        

                return repo.save(user);
        
    }

    public void DeleteUser(Long id){
        SystemUser existingUser = getUser(id);
        repo.delete(existingUser);
    }
}
