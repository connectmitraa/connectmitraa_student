package com.studyloop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doubt_replies")
public class DoubtReply {

    @Id
    private String id;

    private String doubtId;
    private String userId;
    private String authorName;
    private String authorPhoto;

    @Column(length = 4000)
    private String content;

    private Boolean isSolution = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public DoubtReply() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDoubtId() { return doubtId; }
    public void setDoubtId(String doubtId) { this.doubtId = doubtId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorPhoto() { return authorPhoto; }
    public void setAuthorPhoto(String authorPhoto) { this.authorPhoto = authorPhoto; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Boolean getIsSolution() { return isSolution; }
    public void setIsSolution(Boolean isSolution) { this.isSolution = isSolution; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
