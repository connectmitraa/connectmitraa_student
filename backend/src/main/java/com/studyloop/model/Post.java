package com.studyloop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    private String id;

    private String userId;
    private String authorName;
    private String authorPhoto;
    private String authorCollege;
    private Boolean authorVerified = false;

    private String postType; // "question", "knowledge", "tip", "achievement", "resource", "project"

    @Column(length = 4000)
    private String content;

    @Column(length = 4000)
    private String codeSnippet;

    private Integer likes = 0;
    private Integer commentsCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Post() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorPhoto() { return authorPhoto; }
    public void setAuthorPhoto(String authorPhoto) { this.authorPhoto = authorPhoto; }

    public String getAuthorCollege() { return authorCollege; }
    public void setAuthorCollege(String authorCollege) { this.authorCollege = authorCollege; }

    public Boolean getAuthorVerified() { return authorVerified; }
    public void setAuthorVerified(Boolean authorVerified) { this.authorVerified = authorVerified; }

    public String getPostType() { return postType; }
    public void setPostType(String postType) { this.postType = postType; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

    public Integer getLikes() { return likes; }
    public void setLikes(Integer likes) { this.likes = likes; }

    public Integer getCommentsCount() { return commentsCount; }
    public void setCommentsCount(Integer commentsCount) { this.commentsCount = commentsCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
