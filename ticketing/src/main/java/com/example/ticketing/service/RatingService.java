package com.example.ticketing.service;



import com.example.ticketing.dto.RatingRequest;
import com.example.ticketing.entity.*;
import com.example.ticketing.enums.TicketStatus;
import com.example.ticketing.exception.ResourceNotFoundException;
import com.example.ticketing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RatingService {

 private final RatingRepository ratingRepository;
 private final TicketRepository ticketRepository;
 private final UserRepository userRepository;

 public void rateTicket(Long ticketId, RatingRequest request) {
     String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
     User currentUser = userRepository.findByEmail(userEmail)
             .orElseThrow(() -> new ResourceNotFoundException("User not found."));

     Ticket ticket = ticketRepository.findById(ticketId)
             .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
     
     if (!ticket.getCreatedBy().getId().equals(currentUser.getId())) {
         throw new AccessDeniedException("You can only rate your own tickets.");
     }

     if (ticket.getStatus() != TicketStatus.RESOLVED && ticket.getStatus() != TicketStatus.CLOSED) {
         throw new IllegalStateException("You can only rate a ticket that has been resolved or closed.");
     }
     
     if (ticket.getRating() != null) {
         throw new IllegalStateException("This ticket has already been rated.");
     }

     Rating rating = new Rating();
     rating.setStars(request.getStars());
     rating.setFeedback(request.getFeedback());
     rating.setTicket(ticket);
     rating.setUser(currentUser);
     
     ratingRepository.save(rating);
 }
}