package com.studyloop.repository;

import com.studyloop.model.Doubt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoubtRepository extends JpaRepository<Doubt, String> {
    List<Doubt> findAllByOrderByCreatedAtDesc();
    List<Doubt> findBySubjectIgnoreCase(String subject);
    List<Doubt> findByStatus(String status);
}
