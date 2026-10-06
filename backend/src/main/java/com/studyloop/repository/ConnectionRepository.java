package com.studyloop.repository;

import com.studyloop.model.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, String> {
    List<Connection> findByRequesterIdOrReceiverId(String requesterId, String receiverId);
    List<Connection> findByReceiverIdAndStatus(String receiverId, String status);
}
