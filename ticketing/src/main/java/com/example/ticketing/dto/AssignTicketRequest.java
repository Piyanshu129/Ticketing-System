package com.example.ticketing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignTicketRequest {
    @NotNull(message = "Agent ID cannot be null")
    private Long agentId;
}