package com.studyloop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "connections")
public class Connection {

    @Id
    private String id;

    private String requesterId;
    private String requesterName;
    private String requesterPhoto;

    private String receiverId;
    private String receiverName;
    private String receiverPhoto;

    private String status = "pending"; // "pending", "accepted", "rejected"

    private LocalDateTime createdAt = LocalDateTime.now();

    public Connection() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRequesterId() { return requesterId; }
    public void setRequesterId(String requesterId) { this.requesterId = requesterId; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public String getRequesterPhoto() { return requesterPhoto; }
    public void setRequesterPhoto(String requesterPhoto) { this.requesterPhoto = requesterPhoto; }

    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getReceiverPhoto() { return receiverPhoto; }
    public void setReceiverPhoto(String receiverPhoto) { this.receiverPhoto = receiverPhoto; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
