package com.example.ticketing.dto;


import com.example.ticketing.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTicketStatusRequest {
    @NotNull(message = "Status cannot be null")
    private TicketStatus status;
}