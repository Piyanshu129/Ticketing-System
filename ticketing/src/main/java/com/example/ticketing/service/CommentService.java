package com.example.ticketing.service;


import com.example.ticketing.dto.CommentRequest;
import com.example.ticketing.dto.CommentResponse;
import com.example.ticketing.dto.UserResponse;
import com.example.ticketing.entity.Comment;
import com.example.ticketing.entity.Ticket;
import com.example.ticketing.entity.User;
import com.example.ticketing.enums.Role;
import com.example.ticketing.exception.ResourceNotFoundException;
import com.example.ticketing.repository.CommentRepository;
import com.example.ticketing.repository.TicketRepository;
import com.example.ticketing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    /**
     * Adds a comment to a specific ticket.
     * Ensures that the user adding the comment is authorized to do so
     * (i.e., they are the ticket creator, an assigned agent, or an admin).
     *
     * @param ticketId The ID of the ticket to comment on.
     * @param request  The comment content.
     * @return A DTO representing the newly created comment.
     */
    @Transactional
    public CommentResponse addCommentToTicket(Long ticketId, CommentRequest request) {
        // 1. Get the current user
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found."));

        // 2. Find the ticket
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        // 3. Authorize the action
        boolean isCreator = ticket.getCreatedBy().getId().equals(currentUser.getId());
        boolean isAssignedAgent = ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isCreator && !isAssignedAgent && !isAdmin) {
            throw new AccessDeniedException("You are not authorized to comment on this ticket.");
        }

        // 4. Create and save the comment
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setTicket(ticket);
        comment.setUser(currentUser);

        Comment savedComment = commentRepository.save(comment);

        // 5. Return the response DTO
        return mapToCommentResponse(savedComment);
    }
    
    private CommentResponse mapToCommentResponse(Comment comment) {
        User user = comment.getUser();
        UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
        return new CommentResponse(comment.getId(), comment.getContent(), userResponse, comment.getCreatedAt());
    }
}