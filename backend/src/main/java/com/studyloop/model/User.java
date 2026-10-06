package com.studyloop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    private String passwordHash;

    private String fullName;

    private String role; // "student", "mentor", "admin"

    private String college;

    private String branch;

    private String year;

    private String profilePhoto;

    private Boolean isVerifiedMentor = false;

    private Boolean isMentor = false;

    private Double rating = 5.0;

    private Integer completedClasses = 0;

    @Column(length = 2000)
    private String bio;

    private String githubUrl;

    private String portfolioUrl;

    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public User(String id, String email, String fullName, String role, String college, String branch) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.college = college;
        this.branch = branch;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public Boolean getIsVerifiedMentor() { return isVerifiedMentor; }
    public void setIsVerifiedMentor(Boolean isVerifiedMentor) { this.isVerifiedMentor = isVerifiedMentor; }

    public Boolean getIsMentor() { return isMentor; }
    public void setIsMentor(Boolean isMentor) { this.isMentor = isMentor; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getCompletedClasses() { return completedClasses; }
    public void setCompletedClasses(Integer completedClasses) { this.completedClasses = completedClasses; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
