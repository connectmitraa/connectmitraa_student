// Initial mock and local storage dataset for StudyLoop (Self-contained, zero external API keys needed)

export const initialUsers = [
  {
    id: "usr_1",
    email: "hemadri@connectmitraa.edu",
    full_name: "Hemadri Kaligiri",
    role: "student",
    college: "VIT Chennai",
    branch: "Computer Science",
    year: "3rd Year",
    profile_photo: "",
    is_verified_mentor: false,
    is_mentor: false,
    rating: 4.7,
    completed_classes: 0,
    skills: ["Java", "Spring Boot", "React", "Data Structures"],
    subjects: ["Object Oriented Programming", "Web Technologies"],
    bio: "Passionate CS student exploring peer-to-peer collaborative learning and distributed systems.",
    github_url: "https://github.com/hemadrikaligiri",
    portfolio_url: "https://hemadri.dev"
  },
  {
    id: "usr_2",
    email: "aarav.sharma@iitm.ac.in",
    full_name: "Aarav Sharma",
    role: "mentor",
    college: "IIT Madras",
    branch: "Computer Science & Engineering",
    year: "4th Year",
    profile_photo: "",
    is_verified_mentor: true,
    is_mentor: true,
    rating: 4.9,
    completed_classes: 65,
    skills: ["Java", "Spring Boot", "System Design", "Microservices", "Docker"],
    subjects: ["Backend Architecture", "Data Structures & Algorithms", "Operating Systems"],
    bio: "Experienced peer mentor. Conducted 65+ peer sessions helping students crack top backend engineering interviews.",
    github_url: "https://github.com/aaravsharma",
    portfolio_url: "https://aarav.tech"
  },
  {
    id: "usr_3",
    email: "priya.patel@pilani.bits-pilani.ac.in",
    full_name: "Priya Patel",
    role: "mentor",
    college: "BITS Pilani",
    branch: "Data Science & AI",
    year: "4th Year",
    profile_photo: "",
    is_verified_mentor: true,
    is_mentor: true,
    rating: 4.8,
    completed_classes: 42,
    skills: ["Python", "Machine Learning", "PyTorch", "FastAPI", "PostgreSQL"],
    subjects: ["Deep Learning Fundamentals", "Applied Machine Learning", "Python for DS"],
    bio: "AI researcher and student mentor. Love breaking down complex mathematical algorithms into intuitive concepts.",
    github_url: "https://github.com/priyapatel",
    portfolio_url: "https://priyapatel.ai"
  },
  {
    id: "usr_4",
    email: "rohan.verma@dtu.ac.in",
    full_name: "Rohan Verma",
    role: "student",
    college: "DTU Delhi",
    branch: "Information Technology",
    year: "2nd Year",
    profile_photo: "",
    is_verified_mentor: false,
    is_mentor: false,
    rating: 4.5,
    completed_classes: 3,
    skills: ["JavaScript", "React", "Node.js", "C++"],
    subjects: ["Frontend Development", "Competitive Programming"],
    bio: "Frontend enthusiast building interactive Web apps and practicing LeetCode daily.",
    github_url: "https://github.com/rohanverma",
    portfolio_url: ""
  },
  {
    id: "usr_admin",
    email: "admin@connectmitraa.edu",
    full_name: "Admin Moderator",
    role: "admin",
    college: "ConnectMitraa HQ",
    branch: "Platform Admin",
    year: "Staff",
    profile_photo: "",
    is_verified_mentor: true,
    is_mentor: true,
    rating: 5.0,
    completed_classes: 120,
    skills: ["Platform Management", "Curriculum Design", "Verification Review"],
    subjects: ["Peer Learning Operations"],
    bio: "ConnectMitraa Platform Administrator. Reviewing mentor verifications and maintaining community standards.",
    github_url: "",
    portfolio_url: ""
  }
];

export const initialPosts = [
  {
    id: "post_1",
    user_id: "usr_2",
    author_name: "Aarav Sharma",
    author_photo: "",
    author_college: "IIT Madras",
    author_verified: true,
    post_type: "knowledge",
    content: "When designing high-concurrency Spring Boot applications with WebSockets, remember that TextWebSocketHandler keeps TCP connections active. Always configure connection pools and consider using Redis Pub/Sub if you scale out multiple instances! 🚀",
    code_snippet: `@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new SignalingWebSocketHandler(), "/ws/signaling")
                .setAllowedOrigins("*");
    }
}`,
    likes: 18,
    liked_by: ["usr_1", "usr_3", "usr_4"],
    comments_count: 3,
    created_date: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "post_2",
    user_id: "usr_3",
    author_name: "Priya Patel",
    author_photo: "",
    author_college: "BITS Pilani",
    author_verified: true,
    post_type: "tip",
    content: "Tip of the day for Machine Learning students: Don't jump straight into fine-tuning LLMs before mastering embeddings and cosine similarity retrieval. Vector indexing will solve 80% of your search and matching challenges efficiently! 💡",
    code_snippet: "",
    likes: 24,
    liked_by: ["usr_1", "usr_2"],
    comments_count: 2,
    created_date: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: "post_3",
    user_id: "usr_1",
    author_name: "Hemadri Kaligiri",
    author_photo: "",
    author_college: "VIT Chennai",
    author_verified: false,
    post_type: "project",
    content: "Excited to share the architecture of ConnectMitraa! We are combining Spring Boot 3.3.4, Java 21, React 18, and WebRTC for browser-to-browser peer learning sessions without any costly third-party services. What features would you like to see next?",
    code_snippet: "",
    likes: 31,
    liked_by: ["usr_2", "usr_3", "usr_4"],
    comments_count: 4,
    created_date: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export const initialComments = [
  {
    id: "comm_1",
    post_id: "post_1",
    user_id: "usr_1",
    author_name: "Hemadri Kaligiri",
    author_photo: "",
    content: "Great explanation Aarav! This helped clarify our signaling server implementation.",
    created_date: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "comm_2",
    post_id: "post_1",
    user_id: "usr_4",
    author_name: "Rohan Verma",
    author_photo: "",
    content: "Thanks for sharing! Are you hosting a class on WebRTC signaling soon?",
    created_date: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: "comm_3",
    post_id: "post_3",
    user_id: "usr_2",
    author_name: "Aarav Sharma",
    author_photo: "",
    content: "Super cool initiative! Would love to mentor peer classes on this platform.",
    created_date: new Date(Date.now() - 3600000 * 10).toISOString()
  }
];

export const initialDoubts = [
  {
    id: "dbt_1",
    user_id: "usr_4",
    author_name: "Rohan Verma",
    author_photo: "",
    subject: "Java",
    topic: "Spring Security 6 & JWT",
    question: "How do I correctly configure OncePerRequestFilter with JWT authentication in Spring Boot 3 without deprecated WebSecurityConfigurerAdapter?",
    code_snippet: `// What is the modern SecurityFilterChain bean configuration?
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}`,
    status: "resolved",
    replies_count: 2,
    created_date: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: "dbt_2",
    user_id: "usr_1",
    author_name: "Hemadri Kaligiri",
    author_photo: "",
    subject: "DSA",
    topic: "Dynamic Programming",
    question: "Having difficulty determining state transitions for the 0/1 Knapsack problem when memory constraint requires 1D array space optimization.",
    code_snippet: `// Why must we iterate backwards for the capacity in 1D space?
for (int i = 0; i < n; i++) {
    for (int w = W; w >= weight[i]; w--) {
        dp[w] = Math.max(dp[w], dp[w - weight[i]] + val[i]);
    }
}`,
    status: "open",
    replies_count: 1,
    created_date: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export const initialDoubtReplies = [
  {
    id: "drep_1",
    doubt_id: "dbt_1",
    user_id: "usr_2",
    author_name: "Aarav Sharma",
    author_photo: "",
    content: "Your filterChain snippet is already the modern Spring Security 6 approach! Just ensure your JwtAuthenticationFilter extracts the Bearer token from the 'Authorization' header and sets SecurityContextHolder.getContext().setAuthentication(auth).",
    is_solution: true,
    created_date: new Date(Date.now() - 3600000 * 7).toISOString()
  },
  {
    id: "drep_2",
    doubt_id: "dbt_2",
    user_id: "usr_2",
    author_name: "Aarav Sharma",
    author_photo: "",
    content: "We iterate backwards because each item can only be used once! If you iterate forwards, dp[w - weight[i]] would represent the updated state containing the current item i, turning it into the Unbounded Knapsack problem.",
    is_solution: false,
    created_date: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

export const initialClasses = [
  {
    id: "cls_1",
    creator_id: "usr_2",
    creator_name: "Aarav Sharma",
    creator_photo: "",
    creator_verified: true,
    title: "Java OOP & Design Patterns Masterclass",
    subject: "Object Oriented Programming",
    topic: "Factory, Singleton, Observer & Strategy Patterns",
    description: "Hands-on coding session demonstrating real-world software design patterns with live code refactoring and Q&A.",
    scheduled_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    scheduled_time: "18:00",
    duration: 60,
    max_participants: 30,
    participants_count: 14,
    class_type: "public",
    is_paid: false,
    price: 0,
    skill_exchange: true,
    status: "scheduled",
    meeting_link: "room_cls_1"
  },
  {
    id: "cls_2",
    creator_id: "usr_3",
    creator_name: "Priya Patel",
    creator_photo: "",
    creator_verified: true,
    title: "FastAPI + Redis Architecture for Production",
    subject: "Backend Engineering",
    topic: "Async Endpoints, In-Memory Caching & Rate Limiting",
    description: "Build an ultra-fast REST API with automated OpenAPI docs, Redis caching, and connection management in 60 minutes.",
    scheduled_date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    scheduled_time: "19:30",
    duration: 75,
    max_participants: 25,
    participants_count: 22,
    class_type: "public",
    is_paid: true,
    price: 49,
    skill_exchange: false,
    status: "scheduled",
    meeting_link: "room_cls_2"
  },
  {
    id: "cls_3",
    creator_id: "usr_2",
    creator_name: "Aarav Sharma",
    creator_photo: "",
    creator_verified: true,
    title: "WebRTC Peer-to-Peer Video Call Signaling",
    subject: "Computer Networks & Real-Time Web",
    topic: "STUN, ICE Candidates, SDP Offer/Answer Exchange",
    description: "Learn how browsers establish direct peer-to-peer audio and video streams using Google STUN and Spring WebSocket signaling.",
    scheduled_date: new Date().toISOString().split('T')[0],
    scheduled_time: "20:00",
    duration: 60,
    max_participants: 40,
    participants_count: 28,
    class_type: "public",
    is_paid: false,
    price: 0,
    skill_exchange: true,
    status: "scheduled",
    meeting_link: "room_cls_3"
  }
];

export const initialConnections = [
  {
    id: "conn_1",
    requester_id: "usr_1",
    requester_name: "Hemadri Kaligiri",
    requester_photo: "",
    receiver_id: "usr_2",
    receiver_name: "Aarav Sharma",
    receiver_photo: "",
    status: "accepted",
    created_date: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "conn_2",
    requester_id: "usr_4",
    requester_name: "Rohan Verma",
    requester_photo: "",
    receiver_id: "usr_1",
    receiver_name: "Hemadri Kaligiri",
    receiver_photo: "",
    status: "accepted",
    created_date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "conn_3",
    requester_id: "usr_3",
    requester_name: "Priya Patel",
    requester_photo: "",
    receiver_id: "usr_1",
    receiver_name: "Hemadri Kaligiri",
    receiver_photo: "",
    status: "pending",
    created_date: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export const initialMessages = [
  {
    id: "msg_1",
    sender_id: "usr_2",
    sender_name: "Aarav Sharma",
    sender_photo: "",
    receiver_id: "usr_1",
    receiver_name: "Hemadri Kaligiri",
    content: "Hey Hemadri! Saw your post about ConnectMitraa. Are you using native WebRTC for the video doubt rooms?",
    created_date: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "msg_2",
    sender_id: "usr_1",
    sender_name: "Hemadri Kaligiri",
    sender_photo: "",
    receiver_id: "usr_2",
    receiver_name: "Aarav Sharma",
    content: "Yes Aarav! Browser-native WebRTC with RTCPeerConnection and Google STUN server for zero external API dependency.",
    created_date: new Date(Date.now() - 3600000 * 1.8).toISOString()
  },
  {
    id: "msg_3",
    sender_id: "usr_2",
    sender_name: "Aarav Sharma",
    sender_photo: "",
    receiver_id: "usr_1",
    receiver_name: "Hemadri Kaligiri",
    content: "That's fantastic. Let me know whenever you want to test the multi-peer signaling room!",
    created_date: new Date(Date.now() - 3600000 * 1.5).toISOString()
  }
];

export const initialMentorApplications = [
  {
    id: "app_1",
    user_id: "usr_1",
    applicant_name: "Hemadri Kaligiri",
    applicant_email: "hemadri@connectmitraa.edu",
    college: "VIT Chennai",
    branch: "Computer Science",
    year: "3rd Year",
    skills: "Java, Spring Boot, React, WebRTC",
    subjects: "Object Oriented Programming, Full Stack Development",
    teaching_experience: "Peer mentored 20+ juniors in campus coding clubs and led workshops on Git and Web APIs.",
    github_url: "https://github.com/hemadrikaligiri",
    portfolio_url: "https://hemadri.dev",
    resume_file: "hemadri_resume_verified.pdf",
    student_id_file: "vit_student_id_card.png",
    status: "pending",
    admin_notes: "",
    created_date: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: "app_2",
    user_id: "usr_4",
    applicant_name: "Rohan Verma",
    applicant_email: "rohan.verma@dtu.ac.in",
    college: "DTU Delhi",
    branch: "Information Technology",
    year: "2nd Year",
    skills: "JavaScript, React, DSA in C++",
    subjects: "Frontend Engineering, Arrays & Trees",
    teaching_experience: "Active mentor in DTU Coding Circle.",
    github_url: "https://github.com/rohanverma",
    portfolio_url: "",
    resume_file: "rohan_resume.pdf",
    student_id_file: "dtu_id_card.png",
    status: "approved",
    admin_notes: "Strong GitHub profile and student credentials verified.",
    created_date: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const initialPlatformSettings = {
  max_class_price: 500,
  platform_fee_percent: 10,
  min_classes_for_paid: 10
};
