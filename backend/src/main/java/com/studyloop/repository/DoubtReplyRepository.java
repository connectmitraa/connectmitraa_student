package com.studyloop.repository;

import com.studyloop.model.DoubtReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoubtReplyRepository extends JpaRepository<DoubtReply, String> {
    List<DoubtReply> findByDoubtIdOrderByCreatedAtAsc(String doubtId);
}
