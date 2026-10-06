package com.studyloop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "class_sessions")
public class ClassSession {

    @Id
    private String id;

    private String creatorId;
    private String creatorName;
    private String creatorPhoto;
    private Boolean creatorVerified = false;

    private String title;
    private String subject;
    private String topic;

    @Column(length = 2000)
    private String description;

    private String scheduledDate;
    private String scheduledTime;
    private Integer duration = 60;
    private Integer maxParticipants = 50;
    private Integer participantsCount = 1;

    private String classType = "public"; // "public", "private"
    private Boolean isPaid = false;
    private Integer price = 0;
    private Boolean skillExchange = true;

    private String status = "scheduled"; // "scheduled", "live", "completed"
    private String meetingLink;

    private LocalDateTime createdAt = LocalDateTime.now();

    public ClassSession() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCreatorId() { return creatorId; }
    public void setCreatorId(String creatorId) { this.creatorId = creatorId; }

    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }

    public String getCreatorPhoto() { return creatorPhoto; }
    public void setCreatorPhoto(String creatorPhoto) { this.creatorPhoto = creatorPhoto; }

    public Boolean getCreatorVerified() { return creatorVerified; }
    public void setCreatorVerified(Boolean creatorVerified) { this.creatorVerified = creatorVerified; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; }

    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

    public Integer getParticipantsCount() { return participantsCount; }
    public void setParticipantsCount(Integer participantsCount) { this.participantsCount = participantsCount; }

    public String getClassType() { return classType; }
    public void setClassType(String classType) { this.classType = classType; }

    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }

    public Boolean getSkillExchange() { return skillExchange; }
    public void setSkillExchange(Boolean skillExchange) { this.skillExchange = skillExchange; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
