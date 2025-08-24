package com.example.ticketing.dto;

import com.example.ticketing.enums.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private Priority priority;
}
