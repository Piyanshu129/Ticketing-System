package com.example.ticketing.dto;

import com.example.ticketing.enums.Priority;
import com.example.ticketing.enums.TicketStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketResponse {
    private Long id;
    private String title;
    private String description;
    private TicketStatus status;
    private Priority priority;
    private UserResponse createdBy;
    private UserResponse assignedTo;
    private List<CommentResponse> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}