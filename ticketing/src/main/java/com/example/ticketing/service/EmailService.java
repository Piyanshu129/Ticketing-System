package com.example.ticketing.service;


import com.example.ticketing.entity.Ticket;
import com.example.ticketing.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Sends a simple text email asynchronously.
     *
     * @param to      The recipient's email address.
     * @param subject The email subject.
     * @param text    The email body.
     */
    @Async
    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
        } catch (Exception e) {
            // In a real application, you should handle this exception, maybe by logging it
            // or sending it to a dead-letter queue.
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    /**
     * Sends a notification when a new ticket is created.
     *
     * @param user   The user who created the ticket.
     * @param ticket The newly created ticket.
     */
    public void notifyTicketCreation(User user, Ticket ticket) {
        String subject = String.format("Ticket #%d Created: %s", ticket.getId(), ticket.getTitle());
        String text = String.format(
            "Hello %s,\n\nYour new ticket has been successfully created.\n\n" +
            "Ticket ID: %d\n" +
            "Title: %s\n" +
            "Priority: %s\n\n" +
            "You will be notified of any updates. Thank you.",
            user.getName(), ticket.getId(), ticket.getTitle(), ticket.getPriority()
        );
        sendSimpleMessage(user.getEmail(), subject, text);
    }

    /**
     * Sends a notification when a ticket's status is changed.
     *
     * @param ticket The ticket that was updated.
     */
    public void notifyStatusChange(Ticket ticket) {
        User user = ticket.getCreatedBy();
        String subject = String.format("Update on Ticket #%d: Status changed to %s", ticket.getId(), ticket.getStatus());
        String text = String.format(
            "Hello %s,\n\nThe status of your ticket '%s' has been updated to: %s.",
            user.getName(), ticket.getTitle(), ticket.getStatus()
        );
        sendSimpleMessage(user.getEmail(), subject, text);
    }
    
    /**
     * Sends a notification when a ticket is assigned to a support agent.
     *
     * @param ticket The ticket that was assigned.
     */
    public void notifyTicketAssignment(Ticket ticket) {
        User agent = ticket.getAssignedTo();
        if (agent == null) return; // Cannot notify if not assigned

        String subject = String.format("You have been assigned Ticket #%d: %s", ticket.getId(), ticket.getTitle());
        String text = String.format(
                "Hello %s,\n\nYou have been assigned a new ticket.\n\n" +
                "Ticket ID: %d\n" +
                "Title: %s\n" +
                "Priority: %s\n" +
                "Created by: %s\n\n" +
                "Please review the ticket details and take appropriate action.",
                agent.getName(), ticket.getId(), ticket.getTitle(), ticket.getPriority(), ticket.getCreatedBy().getName()
        );
        sendSimpleMessage(agent.getEmail(), subject, text);
    }

}