package com.example.ticketing.service;


import com.example.ticketing.entity.Attachment;
import com.example.ticketing.entity.Ticket;
import com.example.ticketing.exception.FileStorageException;
import com.example.ticketing.exception.ResourceNotFoundException;
import com.example.ticketing.repository.AttachmentRepository;
import com.example.ticketing.repository.TicketRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    /**
     * Stores a file and associates it with a ticket.
     *
     * @param file     The file to be stored.
     * @param ticketId The ID of the ticket to associate the file with.
     * @return The saved Attachment entity.
     */
    public Attachment storeFile(MultipartFile file, Long ticketId) {
        // Find the ticket
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        // Normalize file name
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            // Check for invalid characters
            if (originalFileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            // Create a unique filename to avoid collisions
            String fileExtension = "";
            try {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            } catch (Exception e) {
                // No extension
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // Copy file to the target location
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Create and save attachment metadata
            Attachment attachment = new Attachment();
            attachment.setFileName(originalFileName); // Store the original name for user reference
            attachment.setFileType(file.getContentType());
            attachment.setFilePath(uniqueFileName); // Store the unique name for retrieval
            attachment.setTicket(ticket);
            
            return attachmentRepository.save(attachment);

        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    /**
     * Loads a file as a Spring Resource.
     *
     * @param fileName The unique name of the file to load.
     * @return The file as a Resource.
     */
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found " + fileName);
        }
    }
}