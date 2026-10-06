package com.studyloop.controller;

import com.studyloop.model.ClassSession;
import com.studyloop.repository.ClassSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired private ClassSessionRepository classSessionRepository;

    @GetMapping
    public List<ClassSession> getAllClasses() {
        return classSessionRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ClassSession createClass(@RequestBody ClassSession session) {
        if (session.getId() == null) {
            session.setId("cls_" + System.currentTimeMillis());
        }
        if (session.getMeetingLink() == null) {
            session.setMeetingLink("room_" + session.getId());
        }
        return classSessionRepository.save(session);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ClassSession> joinClass(@PathVariable String id) {
        Optional<ClassSession> cOpt = classSessionRepository.findById(id);
        if (cOpt.isEmpty()) return ResponseEntity.notFound().build();

        ClassSession c = cOpt.get();
        c.setParticipantsCount((c.getParticipantsCount() == null ? 0 : c.getParticipantsCount()) + 1);
        return ResponseEntity.ok(classSessionRepository.save(c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClass(@PathVariable String id) {
        classSessionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
