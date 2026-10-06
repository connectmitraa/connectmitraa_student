package com.studyloop.controller;

import com.studyloop.model.Message;
import com.studyloop.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class ChatController {

    @Autowired private MessageRepository messageRepository;

    @GetMapping("/conversation")
    public List<Message> getConversation(@RequestParam String userId1, @RequestParam String userId2) {
        return messageRepository.findConversation(userId1, userId2);
    }

    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        if (message.getId() == null) {
            message.setId("msg_" + System.currentTimeMillis());
        }
        return messageRepository.save(message);
    }
}
