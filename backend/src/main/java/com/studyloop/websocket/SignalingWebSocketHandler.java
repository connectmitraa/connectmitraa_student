package com.studyloop.websocket;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class SignalingWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Map of roomId -> Set of active WebSocketSessions
    private final Map<String, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();

    // Map of sessionId -> roomId
    private final Map<String, String> sessionRooms = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Connection ready
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        Map<String, Object> data = objectMapper.readValue(payload, new TypeReference<Map<String, Object>>() {});
        String type = (String) data.get("type");
        String roomId = (String) data.get("roomId");

        if (roomId == null) return;

        if ("join".equals(type)) {
            sessionRooms.put(session.getId(), roomId);
            roomSessions.computeIfAbsent(roomId, k -> new CopyOnWriteArraySet<>()).add(session);

            // Notify others in room
            broadcastToRoom(roomId, session, payload);

            // Send confirmation to sender
            Map<String, Object> welcome = new HashMap<>();
            welcome.put("type", "joined");
            welcome.put("roomId", roomId);
            welcome.put("peerCount", roomSessions.get(roomId).size());
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(welcome)));

        } else if ("offer".equals(type) || "answer".equals(type) || "candidate".equals(type) || "chat".equals(type)) {
            // Forward signaling messages to other peers in room
            broadcastToRoom(roomId, session, payload);

        } else if ("leave".equals(type)) {
            removeSessionFromRoom(session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        removeSessionFromRoom(session);
    }

    private void broadcastToRoom(String roomId, WebSocketSession sender, String payload) {
        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions != null) {
            for (WebSocketSession s : sessions) {
                if (s.isOpen() && !s.getId().equals(sender.getId())) {
                    try {
                        s.sendMessage(new TextMessage(payload));
                    } catch (IOException e) {
                        // ignore dropped packet
                    }
                }
            }
        }
    }

    private void removeSessionFromRoom(WebSocketSession session) {
        String roomId = sessionRooms.remove(session.getId());
        if (roomId != null) {
            Set<WebSocketSession> sessions = roomSessions.get(roomId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    roomSessions.remove(roomId);
                } else {
                    // Notify peers of peer disconnect
                    Map<String, Object> leaveNotice = new HashMap<>();
                    leaveNotice.put("type", "peer-left");
                    leaveNotice.put("sessionId", session.getId());
                    try {
                        String noticeJson = objectMapper.writeValueAsString(leaveNotice);
                        broadcastToRoom(roomId, session, noticeJson);
                    } catch (Exception e) {
                        // ignore
                    }
                }
            }
        }
    }
}
