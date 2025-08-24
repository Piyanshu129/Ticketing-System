package com.example.ticketing.controller;


import com.example.ticketing.dto.TicketResponse;
import com.example.ticketing.dto.UpdateRoleRequest;
import com.example.ticketing.dto.UserResponse;
import com.example.ticketing.enums.Priority;
import com.example.ticketing.enums.TicketStatus;
import com.example.ticketing.service.TicketService;
import com.example.ticketing.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.ticketing.dto.AssignTicketRequest;


import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final TicketService ticketService;
    
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @GetMapping("/tickets")
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ticketService.getAllTickets(status, priority, search));
    }

    
    @PutMapping("/tickets/{ticketId}/assign")
    public ResponseEntity<TicketResponse> assignTicket(
            @PathVariable Long ticketId,
            @Valid @RequestBody AssignTicketRequest request) {
        TicketResponse updatedTicket = ticketService.assignTicketToAgent(ticketId, request.getAgentId());
        return ResponseEntity.ok(updatedTicket);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest request) {
        return ResponseEntity.ok(userService.updateUserRole(id, request.getRole()));
    }
}