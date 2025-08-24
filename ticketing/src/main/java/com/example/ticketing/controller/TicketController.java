package com.example.ticketing.controller;


import com.example.ticketing.dto.CommentRequest;
import com.example.ticketing.dto.CommentResponse;
import com.example.ticketing.dto.RatingRequest;
import com.example.ticketing.dto.TicketRequest;
import com.example.ticketing.dto.TicketResponse;
import com.example.ticketing.dto.UpdateTicketStatusRequest;
import com.example.ticketing.enums.*;
import com.example.ticketing.service.CommentService;
import com.example.ticketing.service.FileStorageService;
import com.example.ticketing.service.RatingService;
import com.example.ticketing.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final CommentService commentService; 
    private final RatingService ratingService;
    private final FileStorageService fileStorageService;

    @PostMapping("/{id}/attachments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> uploadAttachment(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        fileStorageService.storeFile(file, id);
        return ResponseEntity.ok("File uploaded successfully: " + file.getOriginalFilename());
    }

    @PostMapping("/{id}/rate")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> rateTicket(@PathVariable Long id, @Valid @RequestBody RatingRequest request) {
        ratingService.rateTicket(id, request);
        return ResponseEntity.ok("Ticket rated successfully.");
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody TicketRequest request) {
        return new ResponseEntity<>(ticketService.createTicket(request), HttpStatus.CREATED);
    }
    
    @GetMapping("/my-tickets")
    public ResponseEntity<List<TicketResponse>> getMyTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ticketService.getAllTicketsForCurrentUser(status, priority, search));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()") // More specific logic inside service
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        // Add security check in service to ensure user owns ticket or is admin/agent
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }
    
    @PostMapping("/{id}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request) {
        CommentResponse newComment = commentService.addCommentToTicket(id, request);
        return new ResponseEntity<>(newComment, HttpStatus.CREATED);
    }

    /**
     * NEW ENDPOINT
     * Updates the status of a ticket. Accessible by Admins or Support Agents.
     * @throws AccessDeniedException 
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPPORT_AGENT')")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request) throws AccessDeniedException {
        TicketResponse updatedTicket = ticketService.updateTicketStatus(id, request.getStatus());
        return ResponseEntity.ok(updatedTicket);
    }
}