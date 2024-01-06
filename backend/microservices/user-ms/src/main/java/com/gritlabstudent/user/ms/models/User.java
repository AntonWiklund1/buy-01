package com.gritlabstudent.user.ms.models;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @NotBlank(message = "User name cannot be empty")
    @Field
    private String name;

    @NotBlank(message = "User email cannot be empty")
    @Field
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "User password cannot be empty")
    @Field
    private String password;

    @NotNull(message = "User role cannot be null")
    @Field
    private String role;
    
    @Field
    private String avatarImagePath; // New field for avatar image path

    public String uuidGenerator() {
        return UUID.randomUUID().toString();
    }


    // Getters and Setters

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getId() {
        return id;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getAvatarImagePath() {
        return avatarImagePath;
    }
    
    public void setAvatarImagePath(String avatarImagePath) {
        this.avatarImagePath = avatarImagePath;
    }
    
}
