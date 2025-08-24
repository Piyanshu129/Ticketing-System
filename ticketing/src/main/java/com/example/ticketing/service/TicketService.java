package com.example.ticketing.service;


import com.example.ticketing.dto.TicketRequest;
import com.example.ticketing.enums.*;
import com.example.ticketing.dto.TicketResponse;
import com.example.ticketing.dto.UserResponse;
import com.example.ticketing.entity.Ticket;
import com.example.ticketing.entity.User;
import com.example.ticketing.enums.TicketStatus;
import com.example.ticketing.exception.ResourceNotFoundException;
import com.example.ticketing.repository.TicketRepository;
import com.example.ticketing.repository.UserRepository;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Sort;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private Specification<Ticket> buildSpecification(TicketStatus status, Priority priority, String search, Long createdById) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            if (priority != null) {
                predicates.add(criteriaBuilder.equal(root.get("priority"), priority));
            }
            if (search != null && !search.isBlank()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + search.toLowerCase() + "%"));
            }
            if (createdById != null) {
                predicates.add(criteriaBuilder.equal(root.get("createdBy").get("id"), createdById));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    
    
    @Transactional
    public TicketResponse createTicket(TicketRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedBy(currentUser);
        
        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToTicketResponse(savedTicket);
    }
    
    public List<TicketResponse> getAllTicketsForCurrentUser(TicketStatus status, Priority priority, String search) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        Specification<Ticket> spec = buildSpecification(status, priority, search, currentUser.getId());
        return ticketRepository.findAll(spec).stream()
                .map(this::mapToTicketResponse)
                .collect(Collectors.toList());
    }

    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        return mapToTicketResponse(ticket);
    }
    
    public List<TicketResponse> getAllTickets(TicketStatus status, Priority priority, String search) {
        Specification<Ticket> spec = buildSpecification(status, priority, search, null);
        return ticketRepository.findAll(spec).stream()
                .map(this::mapToTicketResponse)
                .collect(Collectors.toList());
    }
    
    // Other methods for updating status, assigning tickets, etc. would go here

    private TicketResponse mapToTicketResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setStatus(ticket.getStatus());
        response.setPriority(ticket.getPriority());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());

        if (ticket.getCreatedBy() != null) {
            response.setCreatedBy(new UserResponse(
                ticket.getCreatedBy().getId(),
                ticket.getCreatedBy().getName(),
                ticket.getCreatedBy().getEmail(),
                ticket.getCreatedBy().getRole()
            ));
        }

        if (ticket.getAssignedTo() != null) {
            response.setAssignedTo(new UserResponse(
                ticket.getAssignedTo().getId(),
                ticket.getAssignedTo().getName(),
                ticket.getAssignedTo().getEmail(),
                ticket.getAssignedTo().getRole()
            ));
        }

        // Mapping comments would be similar
        // response.setComments(...)
        
        return response;
    }
    @Transactional
    public TicketResponse assignTicketToAgent(Long ticketId, Long agentId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent user not found with id: " + agentId));

        if (agent.getRole() != Role.ROLE_SUPPORT_AGENT && agent.getRole() != Role.ROLE_ADMIN) {
            throw new IllegalArgumentException("User is not a support agent or admin and cannot be assigned tickets.");
        }

        ticket.setAssignedTo(agent);
        Ticket updatedTicket = ticketRepository.save(ticket);
        
        // Notify the agent they have a new ticket
        emailService.notifyTicketAssignment(updatedTicket);

        return mapToTicketResponse(updatedTicket);
    }
    @Transactional
    public TicketResponse updateTicketStatus(Long ticketId, TicketStatus newStatus) throws AccessDeniedException {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        // Security Check: Ensure the current user is authorized to change the status
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found."));

        boolean isAssignedAgent = ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isAssignedAgent && !isAdmin) {
            throw new AccessDeniedException("You are not authorized to change the status of this ticket.");
        }

        ticket.setStatus(newStatus);
        Ticket updatedTicket = ticketRepository.save(ticket);

        // Notify the user who created the ticket about the status change
        emailService.notifyStatusChange(updatedTicket);

        return mapToTicketResponse(updatedTicket);
    }
    
    
}