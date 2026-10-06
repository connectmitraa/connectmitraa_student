package com.studyloop.controller;

import com.studyloop.model.Doubt;
import com.studyloop.model.DoubtReply;
import com.studyloop.repository.DoubtReplyRepository;
import com.studyloop.repository.DoubtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doubts")
public class DoubtController {

    @Autowired private DoubtRepository doubtRepository;
    @Autowired private DoubtReplyRepository doubtReplyRepository;

    @GetMapping
    public List<Doubt> getAllDoubts() {
        return doubtRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public Doubt createDoubt(@RequestBody Doubt doubt) {
        if (doubt.getId() == null) {
            doubt.setId("dbt_" + System.currentTimeMillis());
        }
        return doubtRepository.save(doubt);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doubt> getDoubtById(@PathVariable String id) {
        return doubtRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/replies")
    public List<DoubtReply> getReplies(@PathVariable String id) {
        return doubtReplyRepository.findByDoubtIdOrderByCreatedAtAsc(id);
    }

    @PostMapping("/{id}/replies")
    public DoubtReply replyDoubt(@PathVariable String id, @RequestBody DoubtReply reply) {
        reply.setId("drep_" + System.currentTimeMillis());
        reply.setDoubtId(id);
        DoubtReply saved = doubtReplyRepository.save(reply);

        doubtRepository.findById(id).ifPresent(d -> {
            d.setRepliesCount((d.getRepliesCount() == null ? 0 : d.getRepliesCount()) + 1);
            doubtRepository.save(d);
        });

        return saved;
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<Doubt> resolveDoubt(@PathVariable String id) {
        Optional<Doubt> dOpt = doubtRepository.findById(id);
        if (dOpt.isEmpty()) return ResponseEntity.notFound().build();

        Doubt d = dOpt.get();
        d.setStatus("resolved");
        return ResponseEntity.ok(doubtRepository.save(d));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoubt(@PathVariable String id) {
        doubtRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
