package com.example.ticketing.dto;



import com.example.ticketing.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRoleRequest {
 @NotNull(message = "Role cannot be null")
 private Role role;
}