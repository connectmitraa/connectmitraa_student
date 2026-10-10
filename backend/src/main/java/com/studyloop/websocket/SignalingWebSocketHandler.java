package com.studyloop.websocket;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * Ultra-scalable, zero-storage WebSocket Signaling Handler for ConnectMitraa Live Classrooms.
 * Handles isolated room routing, targeted WebRTC peer handshakes (offer/answer/ICE candidate),
 * and high-concurrency broadcast for 100k+ users.
 */
@Component
public class SignalingWebSocketHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(SignalingWebSocketHandler.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Map of roomId -> Set of active WebSocketSessions
    private final Map<String, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();

    // Map of sessionId -> roomId
    private final Map<String, String> sessionRooms = new ConcurrentHashMap<>();

    // Map of (roomId + ":" + userId) -> WebSocketSession for targeted peer-to-peer signaling
    private final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    // Map of sessionId -> userId
    private final Map<String, String> sessionUsers = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Connection ready for room subscription
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        Map<String, Object> data = objectMapper.readValue(payload, new TypeReference<Map<String, Object>>() {});
        String type = (String) data.get("type");
        String roomId = (String) data.get("roomId");
        String userId = data.get("userId") != null ? String.valueOf(data.get("userId")) : session.getId();

        if (roomId == null || roomId.trim().isEmpty()) {
            return;
        }

        if ("join".equals(type)) {
            sessionRooms.put(session.getId(), roomId);
            sessionUsers.put(session.getId(), userId);
            userSessions.put(roomId + ":" + userId, session);

            roomSessions.computeIfAbsent(roomId, k -> new CopyOnWriteArraySet<>()).add(session);

            // Notify all other peers in this room that a new participant joined
            broadcastToRoom(roomId, session, payload);

            // Send instant confirmation with current room participant count
            Map<String, Object> welcome = new HashMap<>();
            welcome.put("type", "joined");
            welcome.put("roomId", roomId);
            welcome.put("sessionId", session.getId());
            welcome.put("peerCount", roomSessions.get(roomId).size());
            safeSendMessage(session, new TextMessage(objectMapper.writeValueAsString(welcome)));

        } else if ("offer".equals(type) || "answer".equals(type) || "candidate".equals(type)) {
            // Targeted WebRTC P2P Signaling: if toPeerId / targetUserId is present, route directly
            String targetUserId = data.get("toPeerId") != null ? String.valueOf(data.get("toPeerId")) 
                                : (data.get("targetUserId") != null ? String.valueOf(data.get("targetUserId")) : null);

            if (targetUserId != null) {
                WebSocketSession targetSession = userSessions.get(roomId + ":" + targetUserId);
                if (targetSession != null && targetSession.isOpen()) {
                    safeSendMessage(targetSession, new TextMessage(payload));
                }
            } else {
                // Broadcast signaling to room peers if no specific target
                broadcastToRoom(roomId, session, payload);
            }

        } else if ("chat".equals(type) || "hand-raise".equals(type) || "lower-hand".equals(type) || 
                   "grant-speaker".equals(type) || "revoke-speaker".equals(type) || "reaction".equals(type) || 
                   "poll-create".equals(type) || "poll-vote".equals(type) || "poll-close".equals(type) || 
                   "whiteboard-draw".equals(type) || "whiteboard-clear".equals(type) || "mute-all".equals(type) || 
                   "qna-ask".equals(type) || "qna-vote".equals(type) || "qna-answer".equals(type)) {
            // Interactive webinar & classroom broadcast events
            broadcastToRoom(roomId, session, payload);

        } else if ("leave".equals(type)) {
            removeSessionFromRoom(session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        removeSessionFromRoom(session);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        removeSessionFromRoom(session);
    }

    /**
     * Broadcasts a payload to all connected peers within the same isolated roomId.
     */
    private void broadcastToRoom(String roomId, WebSocketSession sender, String payload) {
        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions == null || sessions.isEmpty()) return;

        TextMessage textMessage = new TextMessage(payload);
        for (WebSocketSession s : sessions) {
            if (s.isOpen() && !s.getId().equals(sender.getId())) {
                safeSendMessage(s, textMessage);
            }
        }
    }

    /**
     * Safely sends a WebSocket message with session synchronization to prevent concurrent socket write exceptions.
     */
    private void safeSendMessage(WebSocketSession session, TextMessage message) {
        if (session != null && session.isOpen()) {
            synchronized (session) {
                try {
                    if (session.isOpen()) {
                        session.sendMessage(message);
                    }
                } catch (IOException e) {
                    log.debug("Session closed during send: {}", session.getId());
                }
            }
        }
    }

    /**
     * Atomically deallocates memory and notifies peers when a user disconnects or leaves.
     */
    private void removeSessionFromRoom(WebSocketSession session) {
        String roomId = sessionRooms.remove(session.getId());
        String userId = sessionUsers.remove(session.getId());

        if (roomId != null) {
            if (userId != null) {
                userSessions.remove(roomId + ":" + userId);
            }

            Set<WebSocketSession> sessions = roomSessions.get(roomId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    // All users left this room - scrub memory immediately
                    roomSessions.remove(roomId);
                } else {
                    // Notify remaining peers of departure
                    Map<String, Object> leaveNotice = new HashMap<>();
                    leaveNotice.put("type", "peer-left");
                    leaveNotice.put("sessionId", session.getId());
                    leaveNotice.put("userId", userId);
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
