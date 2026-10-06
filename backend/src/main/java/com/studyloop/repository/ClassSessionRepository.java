package com.studyloop.repository;

import com.studyloop.model.ClassSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassSessionRepository extends JpaRepository<ClassSession, String> {
    List<ClassSession> findAllByOrderByCreatedAtDesc();
    List<ClassSession> findByCreatorId(String creatorId);
    List<ClassSession> findByClassType(String classType);
}
