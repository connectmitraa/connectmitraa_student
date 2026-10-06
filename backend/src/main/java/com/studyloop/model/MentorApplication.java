package com.studyloop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mentor_applications")
public class MentorApplication {

    @Id
    private String id;

    private String userId;
    private String applicantName;
    private String applicantEmail;

    private String college;
    private String branch;
    private String year;

    @Column(length = 2000)
    private String skills;

    @Column(length = 2000)
    private String subjects;

    @Column(length = 4000)
    private String teachingExperience;

    private String githubUrl;
    private String portfolioUrl;
    private String resumeFile;
    private String studentIdFile;

    private String status = "pending"; // "pending", "approved", "rejected"

    @Column(length = 2000)
    private String adminNotes;

    private LocalDateTime createdAt = LocalDateTime.now();

    public MentorApplication() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public String getApplicantEmail() { return applicantEmail; }
    public void setApplicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getSubjects() { return subjects; }
    public void setSubjects(String subjects) { this.subjects = subjects; }

    public String getTeachingExperience() { return teachingExperience; }
    public void setTeachingExperience(String teachingExperience) { this.teachingExperience = teachingExperience; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getResumeFile() { return resumeFile; }
    public void setResumeFile(String resumeFile) { this.resumeFile = resumeFile; }

    public String getStudentIdFile() { return studentIdFile; }
    public void setStudentIdFile(String studentIdFile) { this.studentIdFile = studentIdFile; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
