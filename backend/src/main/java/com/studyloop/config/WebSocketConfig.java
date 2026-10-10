package com.studyloop.config;

import com.studyloop.websocket.SignalingWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    private SignalingWebSocketHandler signalingWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(signalingWebSocketHandler, "/ws/signaling", "/ws/doubt-room")
                .setAllowedOrigins("*");
    }

    /**
     * High-throughput WebSocket Container configuration for 10,000+ concurrent users & webinars.
     * Prevents buffer overflow and ensures ultra-low packet drops during live events.
     */
    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        // 512 KB Text buffer for rich JSON event packets
        container.setMaxTextMessageBufferSize(512 * 1024);
        // 512 KB Binary buffer for whiteboard / audio slices
        container.setMaxBinaryMessageBufferSize(512 * 1024);
        // 5 minutes max session idle timeout
        container.setMaxSessionIdleTimeout(300000L);
        // 15 seconds async send timeout
        container.setAsyncSendTimeout(15000L);
        return container;
    }
}
