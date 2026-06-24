import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.*;

@Entity
@Table(name="system_users")

public class Systemuser{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)

    private Long id;
    @Column(unique= true)

    private String username;
    private String password;
    private String email;


       public SystemUser(){

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


 

    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id=id;
    }

    
}