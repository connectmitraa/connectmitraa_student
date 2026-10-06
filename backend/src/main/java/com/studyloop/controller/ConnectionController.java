package com.studyloop.controller;

import com.studyloop.model.Connection;
import com.studyloop.repository.ConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    @Autowired private ConnectionRepository connectionRepository;

    @GetMapping
    public List<Connection> getConnections(@RequestParam String userId) {
        return connectionRepository.findByRequesterIdOrReceiverId(userId, userId);
    }

    @PostMapping
    public Connection createConnection(@RequestBody Connection connection) {
        if (connection.getId() == null) {
            connection.setId("conn_" + System.currentTimeMillis());
        }
        return connectionRepository.save(connection);
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<Connection> accept(@PathVariable String id) {
        Optional<Connection> cOpt = connectionRepository.findById(id);
        if (cOpt.isEmpty()) return ResponseEntity.notFound().build();

        Connection c = cOpt.get();
        c.setStatus("accepted");
        return ResponseEntity.ok(connectionRepository.save(c));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable String id) {
        connectionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
