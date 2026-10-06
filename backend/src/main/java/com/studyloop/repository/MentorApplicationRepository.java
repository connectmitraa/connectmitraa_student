package com.studyloop.repository;

import com.studyloop.model.MentorApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorApplicationRepository extends JpaRepository<MentorApplication, String> {
    List<MentorApplication> findAllByOrderByCreatedAtDesc();
    List<MentorApplication> findByStatus(String status);
    Optional<MentorApplication> findByUserId(String userId);
}
