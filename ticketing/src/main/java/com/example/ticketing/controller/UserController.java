package com.example.ticketing.controller;


import com.example.ticketing.dto.UpdateUserRequest;
import com.example.ticketing.dto.UserResponse;
import com.example.ticketing.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Gets the profile information of the currently authenticated user.
     *
     * @return The current user's profile details.
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUserProfile() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.getUserByEmail(currentUserEmail));
    }

    /**
     * Updates the profile of the currently authenticated user.
     *
     * @param request The request body containing the fields to update.
     * @return The updated user's profile details.
     */
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateUserProfile(@Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUserProfile(request));
    }
}