package com.studyloop.controller;

import com.studyloop.config.JwtTokenProvider;
import com.studyloop.model.User;
import com.studyloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isEmpty()) {
            // Auto register or guest student login
            User newUser = new User("usr_" + System.currentTimeMillis(), email, email.split("@")[0], "student", "Engineering College", "CSE");
            if (password != null && !password.isBlank()) {
                newUser.setPasswordHash(passwordEncoder.encode(password));
            }
            userRepository.save(newUser);
            userOpt = Optional.of(newUser);
        } else {
            User existing = userOpt.get();
            if (existing.getPasswordHash() != null && password != null && !password.isBlank()) {
                if (!passwordEncoder.matches(password, existing.getPasswordHash())) {
                    return ResponseEntity.status(401).body("Invalid credentials");
                }
            }
        }

        User user = userOpt.get();
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmailIgnoreCase(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        if (user.getId() == null) {
            user.setId("usr_" + System.currentTimeMillis());
        }
        if (user.getPasswordHash() != null) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        User saved = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(saved.getId(), saved.getEmail(), saved.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", saved);
        return ResponseEntity.ok(response);
    }
}
