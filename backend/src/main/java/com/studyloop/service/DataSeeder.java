package com.studyloop.service;

import com.studyloop.model.*;
import com.studyloop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private PostRepository postRepository;
    @Autowired private DoubtRepository doubtRepository;
    @Autowired private ClassSessionRepository classSessionRepository;
    @Autowired private MentorApplicationRepository mentorApplicationRepository;
    @Autowired private PlatformSettingsRepository platformSettingsRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return;

        // 1. Users
        User u1 = new User("usr_1", "hemadri@connectmitraa.edu", "Hemadri Kaligiri", "student", "VIT Chennai", "Computer Science");
        u1.setIsVerifiedMentor(false);
        u1.setBio("Passionate CS student exploring peer-to-peer collaborative learning and distributed systems.");
        u1.setGithubUrl("https://github.com/hemadrikaligiri");
        u1.setPortfolioUrl("https://hemadri.dev");

        User u2 = new User("usr_2", "aarav.sharma@iitm.ac.in", "Aarav Sharma", "mentor", "IIT Madras", "Computer Science & Engineering");
        u2.setIsVerifiedMentor(true);
        u2.setIsMentor(true);
        u2.setRating(4.9);
        u2.setCompletedClasses(65);
        u2.setBio("Experienced peer mentor. Conducted 65+ peer sessions helping students crack top backend engineering interviews.");
        u2.setGithubUrl("https://github.com/aaravsharma");

        User u3 = new User("usr_3", "priya.patel@pilani.bits-pilani.ac.in", "Priya Patel", "mentor", "BITS Pilani", "Data Science & AI");
        u3.setIsVerifiedMentor(true);
        u3.setIsMentor(true);
        u3.setRating(4.8);
        u3.setCompletedClasses(42);
        u3.setBio("AI researcher and student mentor. Love breaking down complex mathematical algorithms into intuitive concepts.");

        User admin = new User("usr_admin", "admin@connectmitraa.edu", "Admin Moderator", "admin", "ConnectMitraa HQ", "Platform Admin");
        admin.setIsVerifiedMentor(true);

        userRepository.saveAll(Arrays.asList(u1, u2, u3, admin));

        // 2. Posts
        Post p1 = new Post();
        p1.setId("post_1");
        p1.setUserId("usr_2");
        p1.setAuthorName("Aarav Sharma");
        p1.setAuthorCollege("IIT Madras");
        p1.setAuthorVerified(true);
        p1.setPostType("knowledge");
        p1.setContent("When designing high-concurrency Spring Boot applications with WebSockets, remember that TextWebSocketHandler keeps TCP connections active. Always configure connection pools and consider using Redis Pub/Sub if you scale out multiple instances! 🚀");
        p1.setCodeSnippet("@Configuration\n@EnableWebSocket\npublic class WebSocketConfig implements WebSocketConfigurer {\n    @Override\n    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {\n        registry.addHandler(new SignalingWebSocketHandler(), \"/ws/signaling\");\n    }\n}");
        p1.setLikes(18);
        p1.setCommentsCount(3);
        postRepository.save(p1);

        // 3. Doubts
        Doubt d1 = new Doubt();
        d1.setId("dbt_1");
        d1.setUserId("usr_1");
        d1.setAuthorName("Hemadri Kaligiri");
        d1.setSubject("Java");
        d1.setTopic("Spring Security 6 & JWT");
        d1.setQuestion("How do I correctly configure OncePerRequestFilter with JWT authentication in Spring Boot 3 without deprecated WebSecurityConfigurerAdapter?");
        d1.setStatus("resolved");
        d1.setRepliesCount(2);
        doubtRepository.save(d1);

        // 4. Classes
        ClassSession c1 = new ClassSession();
        c1.setId("cls_1");
        c1.setCreatorId("usr_2");
        c1.setCreatorName("Aarav Sharma");
        c1.setCreatorVerified(true);
        c1.setTitle("Java OOP & Design Patterns Masterclass");
        c1.setSubject("Object Oriented Programming");
        c1.setTopic("Factory, Singleton & Strategy");
        c1.setDescription("Hands-on coding session demonstrating real-world software design patterns with live code refactoring.");
        c1.setScheduledDate("2026-10-10");
        c1.setScheduledTime("18:00");
        c1.setDuration(60);
        c1.setMaxParticipants(30);
        c1.setParticipantsCount(14);
        c1.setClassType("public");
        c1.setIsPaid(false);
        classSessionRepository.save(c1);

        // 5. Mentor Applications
        MentorApplication app1 = new MentorApplication();
        app1.setId("app_1");
        app1.setUserId("usr_1");
        app1.setApplicantName("Hemadri Kaligiri");
        app1.setApplicantEmail("hemadri@connectmitraa.edu");
        app1.setCollege("VIT Chennai");
        app1.setBranch("Computer Science");
        app1.setYear("3rd Year");
        app1.setSkills("Java, Spring Boot, React, WebRTC");
        app1.setSubjects("Object Oriented Programming, Full Stack Development");
        app1.setTeachingExperience("Peer mentored 20+ juniors in campus coding clubs.");
        app1.setGithubUrl("https://github.com/hemadrikaligiri");
        app1.setPortfolioUrl("https://hemadri.dev");
        app1.setResumeFile("hemadri_resume_verified.pdf");
        app1.setStudentIdFile("vit_student_id_card.png");
        app1.setStatus("pending");
        mentorApplicationRepository.save(app1);

        // 6. Settings
        PlatformSettings ps = new PlatformSettings();
        platformSettingsRepository.save(ps);
    }
}
