package com.studyloop.controller;

import com.studyloop.model.MentorApplication;
import com.studyloop.model.PlatformSettings;
import com.studyloop.model.User;
import com.studyloop.repository.MentorApplicationRepository;
import com.studyloop.repository.PlatformSettingsRepository;
import com.studyloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private MentorApplicationRepository mentorApplicationRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PlatformSettingsRepository platformSettingsRepository;

    @GetMapping("/applications")
    public List<MentorApplication> getApplications() {
        return mentorApplicationRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/applications/{id}/approve")
    public ResponseEntity<?> approveApplication(@PathVariable String id) {
        Optional<MentorApplication> appOpt = mentorApplicationRepository.findById(id);
        if (appOpt.isEmpty()) return ResponseEntity.notFound().build();

        MentorApplication app = appOpt.get();
        app.setStatus("approved");
        mentorApplicationRepository.save(app);

        // Auto verify student
        userRepository.findById(app.getUserId()).ifPresent(u -> {
            u.setIsVerifiedMentor(true);
            u.setIsMentor(true);
            u.setRole("mentor");
            userRepository.save(u);
        });

        return ResponseEntity.ok(app);
    }

    @PostMapping("/applications/{id}/reject")
    public ResponseEntity<?> rejectApplication(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        Optional<MentorApplication> appOpt = mentorApplicationRepository.findById(id);
        if (appOpt.isEmpty()) return ResponseEntity.notFound().build();

        MentorApplication app = appOpt.get();
        app.setStatus("rejected");
        if (body != null && body.containsKey("notes")) {
            app.setAdminNotes(body.get("notes"));
        }
        return ResponseEntity.ok(mentorApplicationRepository.save(app));
    }

    @GetMapping("/students")
    public List<User> getStudents() {
        return userRepository.findAll();
    }

    @PatchMapping("/students/{id}/toggle-verify")
    public ResponseEntity<?> toggleVerify(@PathVariable String id) {
        Optional<User> uOpt = userRepository.findById(id);
        if (uOpt.isEmpty()) return ResponseEntity.notFound().build();
        User u = uOpt.get();
        boolean nextStatus = !Boolean.TRUE.equals(u.getIsVerifiedMentor());
        u.setIsVerifiedMentor(nextStatus);
        u.setIsMentor(nextStatus);
        return ResponseEntity.ok(userRepository.save(u));
    }

    @GetMapping("/settings")
    public PlatformSettings getSettings() {
        return platformSettingsRepository.findById("default_settings")
                .orElseGet(() -> platformSettingsRepository.save(new PlatformSettings()));
    }

    @PutMapping("/settings")
    public PlatformSettings updateSettings(@RequestBody PlatformSettings settings) {
        settings.setId("default_settings");
        return platformSettingsRepository.save(settings);
    }
}
