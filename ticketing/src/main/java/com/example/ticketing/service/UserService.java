package com.example.ticketing.service;


import com.example.ticketing.dto.UpdateUserRequest;
import com.example.ticketing.config.*;
import com.example.ticketing.dto.UserResponse;
import com.example.ticketing.entity.User;
import com.example.ticketing.enums.*;
import com.example.ticketing.exception.ResourceNotFoundException;
import com.example.ticketing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
	
	private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole()))
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    /**
     * Updates the profile (name and/or password) of the currently authenticated user.
     *
     * @param request The request DTO containing the new name and/or password.
     * @return A DTO representing the updated user.
     */
    @Transactional
    public UserResponse updateUserProfile(UpdateUserRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        request.getName().ifPresent(currentUser::setName);

        request.getPassword().ifPresent(newPassword ->
                currentUser.setPassword(passwordEncoder.encode(newPassword))
        );

        User updatedUser = userRepository.save(currentUser);
        return new UserResponse(updatedUser.getId(), updatedUser.getName(), updatedUser.getEmail(), updatedUser.getRole());
    }
    
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public UserResponse updateUserRole(Long id, Role newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        return new UserResponse(updatedUser.getId(), updatedUser.getName(), updatedUser.getEmail(), updatedUser.getRole());
    }
    
}