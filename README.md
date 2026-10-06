# ConnectMitraa — Peer-to-Peer Collaborative Learning Platform

A full-stack peer-to-peer collaborative learning platform built exactly to replicate the student portal UI, design system, colors, components, and real-time workflows from `https://studentconnect-76f769ea.base44.app/Home`.

---

## 🌟 Highlights & Key Features

- **100% Self-Contained (Zero External API Keys Needed)**:
  - All avatars, authentication tokens, peer connections, and data persistence work out-of-the-box locally without needing external keys or paid services.
- **Exact UI & Design System**:
  - Exact color tokens: Primary Indigo (`#4F46E5`), Accent Emerald (`#10B981`), Slate backgrounds (`#F8FAFC`, `#0F172A`), Cards (`#FFFFFF`), Borders (`#E2E8F0`).
  - Inter & Fraunces typography, custom CSS variables, glassmorphism, responsive left sidebar (250px), mobile slideover navigation, and micro-animations.
- **Direct Admin Panel Routing**:
  - Typing `/admin` into your browser URL or clicking **Admin Panel** in the sidebar immediately opens the Admin Panel with its 6 moderation & settings tabs.
- **Interactive WebRTC Video/Audio Classroom**:
  - Live video and audio peer room with camera/mic controls, screen sharing via `getDisplayMedia`, Google STUN server (`stun:stun.l.google.com:19302`), in-class live chat, and live doubts upvoting board.
- **Quick Persona Switcher**:
  - Effortlessly toggle between **Student** (`Hemadri Kaligiri`), **Verified Mentor** (`Aarav Sharma`), and **Admin** with one click in the sidebar to test all role-based features immediately!

---

## 🚀 Technology Stack

### 1. Frontend
- **Framework & Build**: React 18.2.0 + Vite 5.0.0 (SPA Architecture)
- **Styling**: Vanilla CSS3 Custom Design System (CSS variables, Glassmorphism, Responsive Grid, no CSS framework)
- **Real-time Audio/Video**: Browser-native WebRTC API (`RTCPeerConnection`, `getUserMedia`, `getDisplayMedia`) with Google STUN server (`stun:stun.l.google.com:19302`)
- **Icons & Micro-animations**: Lucide React, Anime.js, Canvas-Confetti

### 2. Backend
- **Language & Runtime**: Java 21 (LTS)
- **Framework**: Spring Boot 3.3.4 (Spring Web MVC, Spring Security 6, Spring Data JPA, Spring WebSocket)
- **Security & JWT**: JJWT 0.11.5 with custom `JwtAuthenticationFilter` and stateless session policy
- **Real-time Signaling**: Spring WebSocket (`TextWebSocketHandler`) for multi-peer WebRTC signaling (`join`, `offer`, `answer`, `candidate`, `chat`, `leave`)
- **Database**: H2 in-memory/file database for zero-setup instant local development; PostgreSQL schema ready for production

---

## 📂 Project Structure

```
connectmitraa/
├── frontend/                     # React 18 + Vite frontend SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx       # Persistent left sidebar with exact brand, navigation & quick persona switcher
│   │   │   └── AuthModal.jsx     # Google mock login, email auth, sign up flow
│   │   ├── context/
│   │   │   └── AppContext.jsx    # Complete application state with localStorage persistence & full CRUD
│   │   ├── data/
│   │   │   └── mockData.js       # Preloaded users, posts, doubts, classes, connections, applications
│   │   ├── pages/
│   │   │   ├── FeedPage.jsx      # /Home feed: post composer with 6 category pills, code snippets, likes & comments
│   │   │   ├── DoubtsPage.jsx    # /Doubts: post doubts, resolution status, code blocks, reply threads
│   │   │   ├── ClassesPage.jsx   # /Classes: All/My Classes, scheduling modal, seats & pricing
│   │   │   ├── LiveClassRoom.jsx # WebRTC Peer-to-Peer classroom: video/audio, screen share, live doubts
│   │   │   ├── ConnectionsPage.jsx # /Connections: My Connections, Pending requests, Discover students
│   │   │   ├── MentorsPage.jsx   # /Mentors: verified mentors directory, 4.9⭐ ratings, profile details
│   │   │   ├── ChatPage.jsx      # /Chat: 2-column real-time messaging interface
│   │   │   ├── ProfilePage.jsx   # /Profile: student profile, verified status, created classes
│   │   │   ├── BecomeMentorPage.jsx # /BecomeMentor: verification banner, application form & document upload
│   │   │   └── AdminPage.jsx     # /admin: 6 moderation tabs (Applications, Students, Posts, Doubts, Classes, Settings)
│   │   ├── App.jsx               # Client router handling /Home, /Doubts, /Classes, /Connections, /Mentors, /Chat, /Profile, /admin
│   │   ├── index.css             # Vanilla CSS design system with HSL/HEX variables matching studentconnect
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── backend/                      # Spring Boot 3.3.4 (Java 21) REST & WebSocket backend
    ├── src/main/java/com/studyloop/
    │   ├── StudyLoopApplication.java
    │   ├── config/
    │   │   ├── SecurityConfig.java
    │   │   ├── JwtTokenProvider.java
    │   │   ├── JwtAuthenticationFilter.java
    │   │   ├── WebSocketConfig.java
    │   │   └── CorsConfig.java
    │   ├── websocket/
    │   │   └── SignalingWebSocketHandler.java # WebRTC peer-to-peer signaling & live room broker
    │   ├── model/                 # JPA Entities: User, Post, PostComment, Doubt, DoubtReply, ClassSession, Connection, Message, MentorApplication, PlatformSettings
    │   ├── repository/            # Spring Data JPA Repositories
    │   ├── controller/            # REST Controllers: AuthController, PostController, DoubtController, ClassController, ConnectionController, ChatController, AdminController
    │   └── service/
    │       └── DataSeeder.java    # Seeds initial database records on application startup
    ├── src/main/resources/
    │   └── application.properties # H2 console, JWT config, port 8080
    └── pom.xml
```

---

## 🏃 Running the Application

### 1. Running the Frontend (Already Running!)
```bash
cd frontend
npm install
npm run dev -- --host
```
The frontend is active at:
👉 **http://localhost:3000/**

To open the Admin Panel directly in your browser:
👉 **http://localhost:3000/admin**

### 2. Running the Spring Boot Backend (Optional for standalone API & H2 Console)
```bash
cd backend
mvn spring-boot:run
```
- API Base URL: `http://localhost:8080/api`
- H2 Database Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:studyloopdb`)
- WebSocket Signaling URL: `ws://localhost:8080/ws/signaling`

---

## 🧭 Page Routes & Features

| Route | Page | Description |
|---|---|---|
| `/` or `/Home` | **Home Feed** | Create post with 6 category badges (`Ask`, `Knowledge`, `Tip`, `Achievement`, `Resource`, `Project`), code snippets, like counters, inline comment threads, and share links. |
| `/Doubts` | **Doubts** | Post doubts with subject, topic, and code snippet; filter by open/resolved; full answers thread and mark as resolved. |
| `/Classes` | **Classes & Live Room** | Browse peer classes, filter My Classes, schedule classes with price (₹) and skill exchange toggles, and click **Enter Live** to join the WebRTC video room! |
| `/Connections` | **Connections** | View accepted connections, incoming pending requests, and discover peers with college filter and connect buttons. |
| `/Mentors` | **Find Mentors** | Explore verified mentors with rating ⭐ 4.9, completed classes counter, skill tags, detailed profile modal, and direct chat. |
| `/Chat` | **Chat** | 2-column messaging interface with real-time send, unread status, and presence indicator. |
| `/Profile` | **Profile** | User details, conducted classes, asked doubts, and quick application button. |
| `/BecomeMentor` | **Become Mentor** | Verification banner with document upload dropzones (Resume PDF & Student ID Card) and submission form. |
| `/admin` | **Admin Panel** | Moderation dashboard with 6 tabs: review mentor applications (Approve / Reject), Students directory, moderate Posts & Doubts, view Classes, and configure Platform Settings. |
