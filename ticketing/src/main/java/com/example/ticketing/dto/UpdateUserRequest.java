package com.example.ticketing.dto;


import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Optional;

@Data
public class UpdateUserRequest {
    
    @Size(min = 2, message = "Name must be at least 2 characters long")
    private String name;

    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    // Helper methods to handle optional values
    public Optional<String> getName() {
        return Optional.ofNullable(name);
    }

    public Optional<String> getPassword() {
        return Optional.ofNullable(password);
    }
}
